#!/bin/bash
################################################################################
# Terry Auto-Fix Script: Restart Docker Container
# Description: Safely restarts a Docker container with health verification
# Risk Level: LOW
# Author: AI-Whisperers
# Version: 1.0.0
################################################################################

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/../logs/container-restart-$(date +%Y%m%d).log"
HEALTH_CHECK_RETRIES=5
HEALTH_CHECK_INTERVAL=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

# Error handler
error_exit() {
    log "ERROR" "${RED}$1${NC}"
    exit 1
}

# Usage information
usage() {
    cat << EOF
Usage: $0 <container_id_or_name>

Description:
    Safely restarts a Docker container with health verification.

Arguments:
    container_id_or_name    Docker container ID or name to restart

Examples:
    $0 abc123def456
    $0 work-hours-api
    $0 terry-n8n

Exit Codes:
    0 - Success
    1 - Container not found
    2 - Restart failed
    3 - Health check failed

EOF
    exit 1
}

# Check if container exists
check_container_exists() {
    local container=$1
    if ! docker ps -a --format '{{.ID}} {{.Names}}' | grep -q "$container"; then
        error_exit "Container '$container' not found"
    fi
    log "INFO" "${GREEN}✓${NC} Container '$container' found"
}

# Get container state
get_container_state() {
    local container=$1
    docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null || echo "not_found"
}

# Get container name
get_container_name() {
    local container=$1
    docker inspect --format='{{.Name}}' "$container" 2>/dev/null | sed 's/^\///' || echo "$container"
}

# Check container health
check_container_health() {
    local container=$1
    local retry_count=0
    
    log "INFO" "Checking container health..."
    
    while [ $retry_count -lt $HEALTH_CHECK_RETRIES ]; do
        local state=$(get_container_state "$container")
        
        if [ "$state" = "running" ]; then
            # Additional health check if container has healthcheck defined
            local health_status=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "$container")
            
            if [ "$health_status" = "healthy" ] || [ "$health_status" = "no-healthcheck" ]; then
                log "INFO" "${GREEN}✓${NC} Container is healthy (health status: $health_status)"
                return 0
            fi
            
            log "WARN" "${YELLOW}!${NC} Container running but not healthy yet (attempt $((retry_count + 1))/$HEALTH_CHECK_RETRIES)"
        else
            log "WARN" "${YELLOW}!${NC} Container not running (state: $state, attempt $((retry_count + 1))/$HEALTH_CHECK_RETRIES)"
        fi
        
        retry_count=$((retry_count + 1))
        if [ $retry_count -lt $HEALTH_CHECK_RETRIES ]; then
            sleep $HEALTH_CHECK_INTERVAL
        fi
    done
    
    return 1
}

# Main restart function
restart_container() {
    local container=$1
    local container_name=$(get_container_name "$container")
    
    log "INFO" "========================================" 
    log "INFO" "Starting container restart: $container_name ($container)"
    log "INFO" "========================================"
    
    # Get initial state
    local initial_state=$(get_container_state "$container")
    log "INFO" "Initial state: $initial_state"
    
    # Get uptime before restart
    if [ "$initial_state" = "running" ]; then
        local started_at=$(docker inspect --format='{{.State.StartedAt}}' "$container")
        log "INFO" "Container was started at: $started_at"
    fi
    
    # Stop container if running
    if [ "$initial_state" = "running" ]; then
        log "INFO" "Stopping container..."
        if docker stop "$container" --time 30; then
            log "INFO" "${GREEN}✓${NC} Container stopped successfully"
        else
            error_exit "Failed to stop container"
        fi
        sleep 2
    else
        log "INFO" "Container already stopped (state: $initial_state)"
    fi
    
    # Start container
    log "INFO" "Starting container..."
    if docker start "$container"; then
        log "INFO" "${GREEN}✓${NC} Container start command executed"
    else
        error_exit "Failed to start container"
    fi
    
    # Wait for container to be ready
    sleep 3
    
    # Verify container is running and healthy
    if check_container_health "$container"; then
        log "INFO" "${GREEN}✓✓✓ Container restarted successfully${NC}"
        
        # Get new state info
        local new_state=$(get_container_state "$container")
        local new_started_at=$(docker inspect --format='{{.State.StartedAt}}' "$container")
        log "INFO" "New state: $new_state"
        log "INFO" "New started at: $new_started_at"
        
        # Get container logs (last 10 lines)
        log "INFO" "Recent container logs:"
        docker logs --tail 10 "$container" 2>&1 | while IFS= read -r line; do
            log "INFO" "  | $line"
        done
        
        # Final success message
        log "INFO" "========================================"
        log "INFO" "${GREEN}SUCCESS${NC}: Container '$container_name' is healthy"
        log "INFO" "========================================"
        
        return 0
    else
        error_exit "Container started but health check failed. Check logs: docker logs $container"
    fi
}

# Main execution
main() {
    # Check arguments
    if [ $# -ne 1 ]; then
        usage
    fi
    
    local container=$1
    
    # Create log directory if it doesn't exist
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Validate Docker is available
    if ! command -v docker &> /dev/null; then
        error_exit "Docker is not installed or not in PATH"
    fi
    
    # Check if Docker daemon is running
    if ! docker info &> /dev/null; then
        error_exit "Docker daemon is not running"
    fi
    
    # Check if container exists
    check_container_exists "$container"
    
    # Perform restart
    restart_container "$container"
    
    # Exit with success
    exit 0
}

# Run main function
main "$@"

