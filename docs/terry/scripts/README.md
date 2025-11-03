# Terry Auto-Fix Scripts

This directory contains bash scripts for automated problem remediation.

## Available Scripts

| Script | Risk Level | Purpose | Auto-Eligible |
|--------|-----------|---------|---------------|
| `fix-restart-container.sh` | LOW | Safely restart Docker container | Yes |
| `fix-cleanup-disk.sh` | LOW | Clean up Docker disk space | Yes |
| `backup.sh` | LOW | Backup n8n data and workflows | Yes |
| `restore.sh` | MEDIUM | Restore from backup | Approval Required |

## Script Usage

### fix-restart-container.sh

Restarts a Docker container with health verification.

**Usage:**
```bash
./fix-restart-container.sh <container_id_or_name>
```

**Examples:**
```bash
# Restart by container ID
./fix-restart-container.sh abc123def456

# Restart by container name
./fix-restart-container.sh work-hours-api
./fix-restart-container.sh terry-n8n

# Check logs
./fix-restart-container.sh work-hours-api 2>&1 | tee restart.log
```

**What it does:**
1. Validates container exists
2. Gets current state
3. Stops container gracefully (30s timeout)
4. Starts container
5. Waits for health checks (5 retries)
6. Verifies container is running
7. Shows recent logs

**Exit codes:**
- `0` - Success
- `1` - Container not found
- `2` - Restart failed
- `3` - Health check failed

**Logs:**
- Location: `../logs/container-restart-YYYYMMDD.log`
- Format: `YYYY-MM-DD HH:MM:SS [LEVEL] message`

---

### fix-cleanup-disk.sh

Cleans up Docker disk space by removing old images, containers, and cache.

**Usage:**
```bash
./fix-cleanup-disk.sh
```

**What it does:**
1. Shows disk space before cleanup
2. Removes Docker images older than 7 days
3. Removes dangling images
4. Removes stopped containers
5. Reports unused volumes (doesn't remove)
6. Removes build cache
7. Cleans unused networks
8. Checks container log sizes
9. Shows disk space after cleanup

**Safe operations:**
- Only removes old/unused resources
- Skips volumes (requires manual review)
- Truncates large logs (>100MB)
- Never touches running containers

**Logs:**
- Location: `../logs/disk-cleanup-YYYYMMDD.log`

---

### backup.sh

Creates backup of n8n data, workflows, and configuration.

**Usage:**
```bash
./backup.sh [backup_name]
```

**Examples:**
```bash
# Auto-named backup
./backup.sh

# Custom name
./backup.sh before-upgrade

# With date
./backup.sh backup-$(date +%Y%m%d)
```

**What it backs up:**
- n8n data volume
- Workflow JSON files
- Environment file (.env)
- Credentials (encrypted)

**Backup location:**
```
../backups/
├── n8n-data-20251103.tar.gz
├── workflows-20251103/
└── env-20251103.backup
```

---

### restore.sh

Restores Terry from a backup.

**Usage:**
```bash
./restore.sh <backup_file>
```

**Example:**
```bash
./restore.sh ../backups/n8n-backup-20251103.tar.gz
```

**⚠️ Warning:**
- This will overwrite current data
- Requires approval workflow
- Stop Terry before restoring

**Process:**
1. Validates backup file exists
2. Stops Terry
3. Restores data
4. Restores workflows
5. Restores environment
6. Starts Terry
7. Verifies restoration

---

## Integration with n8n

### Calling Scripts from n8n Workflows

**Method 1: SSH Node**

```json
{
  "command": "./scripts/fix-restart-container.sh {{$json.container_id}}",
  "cwd": "/path/to/terry"
}
```

**Method 2: Execute Command Node**

```json
{
  "command": "bash",
  "arguments": [
    "/path/to/terry/scripts/fix-restart-container.sh",
    "{{$json.container_id}}"
  ]
}
```

**Method 3: HTTP Request (via wrapper API)**

```bash
# Create simple API wrapper
curl -X POST http://localhost:3000/fix/restart-container \
  -H "Content-Type: application/json" \
  -d '{"container_id": "abc123"}'
```

---

## Script Development

### Creating New Scripts

**Template:**

```bash
#!/bin/bash
################################################################################
# Terry Auto-Fix Script: [Script Name]
# Description: [What it does]
# Risk Level: [LOW|MEDIUM|HIGH]
# Author: AI-Whisperers
# Version: 1.0.0
################################################################################

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/../logs/script-name-$(date +%Y%m%d).log"

# Logging
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

error_exit() {
    log "ERROR" "$1"
    exit 1
}

# Main function
main() {
    log "INFO" "Starting [script name]..."
    
    # Your logic here
    
    log "INFO" "Complete"
    exit 0
}

main "$@"
```

### Risk Levels

**LOW (Auto-fix eligible):**
- Reversible operations
- No data loss risk
- Affects only single service
- Examples: restart, clear cache

**MEDIUM (Requires approval):**
- May affect service availability
- Some complexity
- Recoverable if fails
- Examples: configuration changes, updates

**HIGH (Human only):**
- Data loss risk
- Affects production
- Irreversible
- Security implications
- Examples: delete data, modify database

### Testing Scripts

```bash
# 1. Syntax check
bash -n ./script.sh

# 2. ShellCheck (if available)
shellcheck ./script.sh

# 3. Dry run (add --dry-run flag to your script)
./script.sh --dry-run

# 4. Test in development
./script.sh test-container

# 5. Check logs
tail -f ../logs/script-name-*.log
```

---

## Security

### Script Permissions

```bash
# Make executable (owner only)
chmod 700 ./fix-restart-container.sh

# Verify
ls -l ./fix-restart-container.sh
# Should show: -rwx------ (700)
```

### Sudo Requirements

Most scripts should NOT require sudo. If needed:

```bash
# Bad (don't do this):
sudo ./script.sh

# Good (configure sudoers):
# /etc/sudoers.d/terry
terry ALL=(ALL) NOPASSWD: /usr/bin/docker restart *
```

### Input Validation

Always validate inputs:

```bash
# Validate container ID format
if [[ ! "$container" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    error_exit "Invalid container ID format"
fi

# Validate file exists
if [ ! -f "$backup_file" ]; then
    error_exit "Backup file not found: $backup_file"
fi
```

---

## Logging

### Log Format

```
YYYY-MM-DD HH:MM:SS [LEVEL] message
```

**Levels:**
- `INFO` - Normal operation
- `WARN` - Warning, but continuing
- `ERROR` - Error, script will exit
- `DEBUG` - Detailed information (if enabled)

### Log Location

```
terry/
└── logs/
    ├── container-restart-20251103.log
    ├── disk-cleanup-20251103.log
    └── backup-20251103.log
```

### Log Rotation

```bash
# Manual rotation
find ../logs -name "*.log" -mtime +30 -delete

# Or use logrotate
# /etc/logrotate.d/terry
/path/to/terry/logs/*.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
}
```

---

## Best Practices

### Do's ✅

- Always validate inputs
- Log all operations
- Use `set -euo pipefail`
- Exit with appropriate codes
- Add usage information
- Test before deploying
- Version your scripts
- Document what it does

### Don'ts ❌

- Don't assume sudo access
- Don't modify production without approval
- Don't use `rm -rf` without validation
- Don't ignore errors
- Don't hardcode credentials
- Don't skip logging
- Don't modify running containers without checks

---

## Troubleshooting

### Script Won't Execute

```bash
# Check permissions
ls -l ./script.sh

# Make executable
chmod +x ./script.sh

# Check shebang
head -n 1 ./script.sh
# Should be: #!/bin/bash
```

### Script Fails Silently

```bash
# Run with debugging
bash -x ./script.sh

# Or add to script:
set -x  # Enable debugging
```

### Can't Write Logs

```bash
# Create log directory
mkdir -p ../logs

# Check permissions
ls -ld ../logs

# Fix if needed
chmod 755 ../logs
```

---

## Examples

### Example 1: Auto-Restart on Detection

**n8n Workflow:**
```
[Docker Health Check]
    ↓
[IF: Container Stopped]
    ↓
[SSH: Execute fix-restart-container.sh]
    ↓
[Email: Report Success/Failure]
```

### Example 2: Scheduled Cleanup

**n8n Workflow:**
```
[Schedule: Daily at 2 AM]
    ↓
[SSH: Execute fix-cleanup-disk.sh]
    ↓
[Parse Output]
    ↓
[IF: Space Freed > 1GB]
    ↓
[Email: Cleanup Report]
```

### Example 3: Approval-Based Restore

**n8n Workflow:**
```
[Manual Trigger]
    ↓
[Select Backup File]
    ↓
[Send Approval Request]
    ↓
[Wait for Approval]
    ↓
[IF: Approved]
    ↓
[SSH: Execute restore.sh]
    ↓
[Email: Restoration Complete]
```

---

## Getting Help

- Main Documentation: [../README.md](../README.md)
- Setup Guide: [../SETUP_GUIDE.md](../SETUP_GUIDE.md)
- Troubleshooting: [../TROUBLESHOOTING_GUIDE.md](../TROUBLESHOOTING_GUIDE.md)
- Workflow Integration: [../WORKFLOW_GUIDES.md](../WORKFLOW_GUIDES.md)

---

**Scripts by AI-Whisperers**

*Automation done right*

