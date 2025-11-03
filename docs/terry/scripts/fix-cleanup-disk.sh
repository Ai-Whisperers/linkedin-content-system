#!/bin/bash
################################################################################
# Terry Auto-Fix Script: Cleanup Disk Space
# Description: Safely removes old Docker images, containers, and build cache
# Risk Level: LOW
# Author: AI-Whisperers
# Version: 1.0.0
################################################################################

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/../logs/disk-cleanup-$(date +%Y%m%d).log"
DAYS_OLD=7  # Remove images older than X days

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

error_exit() {
    log "ERROR" "${RED}$1${NC}"
    exit 1
}

# Get disk usage
get_disk_usage() {
    df -h / | awk 'NR==2 {print $5}' | sed 's/%//'
}

# Get Docker disk usage
get_docker_disk_usage() {
    docker system df --format "{{.Type}}\t{{.TotalCount}}\t{{.Size}}\t{{.Reclaimable}}" 2>/dev/null || echo "Error getting Docker disk usage"
}

# Display disk space before cleanup
show_disk_before() {
    log "INFO" "========================================"
    log "INFO" "Disk Space BEFORE Cleanup"
    log "INFO" "========================================"
    
    local disk_usage=$(get_disk_usage)
    log "INFO" "System disk usage: ${disk_usage}%"
    
    log "INFO" ""
    log "INFO" "Docker disk usage:"
    get_docker_disk_usage | while IFS= read -r line; do
        log "INFO" "  $line"
    done
    log "INFO" ""
}

# Display disk space after cleanup
show_disk_after() {
    log "INFO" "========================================"
    log "INFO" "Disk Space AFTER Cleanup"
    log "INFO" "========================================"
    
    local disk_usage=$(get_disk_usage)
    log "INFO" "System disk usage: ${disk_usage}%"
    
    log "INFO" ""
    log "INFO" "Docker disk usage:"
    get_docker_disk_usage | while IFS= read -r line; do
        log "INFO" "  $line"
    done
    log "INFO" ""
}

# Remove old Docker images
cleanup_old_images() {
    log "INFO" "${BLUE}Step 1:${NC} Removing Docker images older than ${DAYS_OLD} days..."
    
    local removed_count=0
    local before_count=$(docker images -q | wc -l)
    
    # Remove images older than DAYS_OLD days
    docker image prune -a --force --filter "until=${DAYS_OLD}*24h" > /dev/null 2>&1 || true
    
    local after_count=$(docker images -q | wc -l)
    removed_count=$((before_count - after_count))
    
    if [ $removed_count -gt 0 ]; then
        log "INFO" "${GREEN}✓${NC} Removed $removed_count old images"
    else
        log "INFO" "${YELLOW}!${NC} No old images to remove"
    fi
}

# Remove dangling images
cleanup_dangling_images() {
    log "INFO" "${BLUE}Step 2:${NC} Removing dangling images (untagged)..."
    
    local dangling_count=$(docker images -f "dangling=true" -q | wc -l)
    
    if [ $dangling_count -gt 0 ]; then
        docker image prune -f > /dev/null 2>&1
        log "INFO" "${GREEN}✓${NC} Removed $dangling_count dangling images"
    else
        log "INFO" "${YELLOW}!${NC} No dangling images to remove"
    fi
}

# Remove stopped containers
cleanup_stopped_containers() {
    log "INFO" "${BLUE}Step 3:${NC} Removing stopped containers..."
    
    local stopped_count=$(docker ps -a -q -f status=exited | wc -l)
    
    if [ $stopped_count -gt 0 ]; then
        docker container prune -f > /dev/null 2>&1
        log "INFO" "${GREEN}✓${NC} Removed $stopped_count stopped containers"
    else
        log "INFO" "${YELLOW}!${NC} No stopped containers to remove"
    fi
}

# Remove unused volumes
cleanup_unused_volumes() {
    log "INFO" "${BLUE}Step 4:${NC} Removing unused volumes..."
    
    local volume_count=$(docker volume ls -qf dangling=true | wc -l)
    
    if [ $volume_count -gt 0 ]; then
        log "WARN" "${YELLOW}!${NC} Found $volume_count unused volumes"
        log "WARN" "Skipping volume removal (manual review recommended)"
        log "INFO" "To remove manually: docker volume prune -f"
    else
        log "INFO" "${GREEN}✓${NC} No unused volumes found"
    fi
}

# Remove build cache
cleanup_build_cache() {
    log "INFO" "${BLUE}Step 5:${NC} Removing Docker build cache..."
    
    local cache_size=$(docker builder du 2>/dev/null | grep "Total:" | awk '{print $2}' || echo "0B")
    
    if [ "$cache_size" != "0B" ]; then
        docker builder prune --all --force > /dev/null 2>&1 || true
        log "INFO" "${GREEN}✓${NC} Removed build cache (was: $cache_size)"
    else
        log "INFO" "${YELLOW}!${NC} No build cache to remove"
    fi
}

# Remove unused networks
cleanup_unused_networks() {
    log "INFO" "${BLUE}Step 6:${NC} Removing unused networks..."
    
    local network_count=$(docker network ls -q -f "type=custom" | wc -l)
    
    if [ $network_count -gt 0 ]; then
        docker network prune -f > /dev/null 2>&1 || true
        log "INFO" "${GREEN}✓${NC} Cleaned up networks"
    else
        log "INFO" "${YELLOW}!${NC} No unused networks to remove"
    fi
}

# Clean system logs (if too large)
cleanup_system_logs() {
    log "INFO" "${BLUE}Step 7:${NC} Checking system log sizes..."
    
    # Clean Docker logs if they're too large (>100MB)
    for container in $(docker ps -q); do
        local container_name=$(docker inspect --format='{{.Name}}' "$container" | sed 's/^\///')
        local log_file=$(docker inspect --format='{{.LogPath}}' "$container")
        
        if [ -f "$log_file" ]; then
            local log_size=$(du -m "$log_file" | awk '{print $1}')
            
            if [ $log_size -gt 100 ]; then
                log "WARN" "${YELLOW}!${NC} Container '$container_name' has large logs (${log_size}MB)"
                log "INFO" "Truncating logs for $container_name..."
                truncate -s 0 "$log_file" 2>/dev/null || log "WARN" "Could not truncate log (may require sudo)"
            fi
        fi
    done
}

# Main cleanup function
main_cleanup() {
    log "INFO" "========================================"
    log "INFO" "Starting Docker Disk Cleanup"
    log "INFO" "========================================"
    
    # Show before state
    show_disk_before
    
    # Run cleanup steps
    cleanup_old_images
    cleanup_dangling_images
    cleanup_stopped_containers
    cleanup_unused_volumes
    cleanup_build_cache
    cleanup_unused_networks
    cleanup_system_logs
    
    # Show after state
    show_disk_after
    
    # Calculate space freed
    log "INFO" "========================================"
    log "INFO" "${GREEN}✓✓✓ Cleanup Complete${NC}"
    log "INFO" "========================================"
}

# Main execution
main() {
    # Create log directory
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Check Docker is available
    if ! command -v docker &> /dev/null; then
        error_exit "Docker is not installed or not in PATH"
    fi
    
    # Check Docker daemon
    if ! docker info &> /dev/null; then
        error_exit "Docker daemon is not running"
    fi
    
    # Check disk usage before proceeding
    local disk_usage=$(get_disk_usage)
    if [ $disk_usage -lt 80 ]; then
        log "INFO" "Current disk usage is ${disk_usage}% (< 80%)"
        log "INFO" "Cleanup may not be necessary, but proceeding anyway..."
    else
        log "WARN" "${YELLOW}!${NC} Current disk usage is ${disk_usage}% (>= 80%)"
        log "WARN" "Cleanup is recommended"
    fi
    
    # Perform cleanup
    main_cleanup
    
    exit 0
}

# Run main
main "$@"

