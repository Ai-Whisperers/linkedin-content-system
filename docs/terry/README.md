# Terry - AI-Whisperers IT Agent

> "If you have to do it more than once, automate it." - AI-Whisperers Philosophy

## Overview

**Terry** is AI-Whisperers' internal AI IT employee - a self-hosted multi-agent automation system built on n8n that monitors, troubleshoots, and maintains our infrastructure 24/7.

Terry represents a practical implementation of our multi-agent systems expertise, demonstrating the agentic design patterns we teach and consult on.

### What Terry Does

- **Monitors**: 6 GitHub repositories, production website, Docker containers, and services
- **Detects**: Problems before they impact users or development
- **Analyzes**: Uses GPT-4 to understand root causes and propose solutions
- **Fixes**: Automatically remediates safe issues, requests approval for risky changes
- **Reports**: Sends intelligent notifications via Email, WhatsApp, and LinkedIn
- **Learns**: Maintains problem history to improve diagnosis over time

### Why We Built Terry

1. **Dogfooding**: We use what we build and teach
2. **Proof of Concept**: Real-world demonstration of multi-agent systems
3. **Content**: Building in public for educational content
4. **Efficiency**: Save 9+ hours/week on manual monitoring and troubleshooting
5. **Service Foundation**: Base for offering similar systems to clients

## Quick Start

### Prerequisites

- Docker installed and running
- Git access to AI-Whisperers organization
- OpenAI API key (GPT-4 access)
- Email SMTP credentials
- WhatsApp Business API account (optional)
- LinkedIn API credentials (optional)

### Installation (5 Minutes)

```bash
# Clone and navigate to project
cd docs/terry

# Run the setup script
./scripts/setup.sh

# Start Terry
docker-compose up -d

# Access n8n interface
open http://localhost:5678
```

For detailed installation instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## Architecture

```
┌─────────────────────────────────────────────────────┐
│         Terry (n8n Workflow Orchestrator)           │
└─────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Monitor    │ │ Troubleshoot │ │   Action     │
│    Agent     │ │    Agent     │ │   Agent      │
└──────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        ▼
        ┌───────────────────────────────┐
        │  Decision Engine (GPT-4)      │
        └───────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Notification │ │   Approval   │ │   Logger     │
│   System     │ │   Workflow   │ │   Agent      │
└──────────────┘ └──────────────┘ └──────────────┘
    │   │   │
    ▼   ▼   ▼
 Email WhatsApp LinkedIn
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design.

## Documentation

### Getting Started
- [Setup Guide](./SETUP_GUIDE.md) - Installation and configuration
- [Notification Setup](./NOTIFICATION_SETUP.md) - Email, WhatsApp, LinkedIn integration

### Implementation
- [Workflow Guides](./WORKFLOW_GUIDES.md) - All 14 workflows across 4 phases
- [API Reference](./API_REFERENCE.md) - Webhooks, functions, credentials

### Operations
- [User Manual](./USER_MANUAL.md) - How to interact with Terry
- [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md) - Common issues and solutions

### Advanced
- [Architecture](./ARCHITECTURE.md) - System design and patterns
- [Workflows](./workflows/) - Exportable n8n workflow JSON files
- [Scripts](./scripts/) - Auto-remediation bash scripts

## Implementation Phases

### Phase 1: Core Monitoring (Week 1)
- GitHub repository health checks
- Website uptime monitoring
- Docker container health
- Basic email/WhatsApp alerts

### Phase 2: Intelligence Layer (Week 2)
- GPT-4 problem analysis
- Smart alert filtering
- Structured output formatting
- Context gathering for decisions

### Phase 3: Auto-Remediation (Week 3)
- Safe auto-fix library
- Human-in-the-loop approval workflows
- Risk assessment logic
- Common fix scripts

### Phase 4: Advanced Integration (Week 4)
- GitHub automation (issue triage, PR management)
- Vercel deployment monitoring
- LinkedIn notifications
- Problem history database
- Monthly reporting

## Infrastructure Monitored

| Component | Count | Check Frequency | Auto-Fix |
|-----------|-------|----------------|----------|
| GitHub Repositories | 6 | Every 6 hours | No |
| Production Website | 1 | Every 15 minutes | No |
| Docker Containers | Variable | Every 30 minutes | Yes (restart) |
| API Endpoints | Variable | Every 15 minutes | No |
| Deployments | On event | Webhook-triggered | No |

## Notification Strategy

| Priority | Channel | Response Time | Use Case |
|----------|---------|---------------|----------|
| Critical | WhatsApp | Immediate | Production down, security issue |
| High | Email | Within 1 hour | Service degradation, failed deployment |
| Medium | Email | Daily digest | Dependency updates, non-critical issues |
| Low | LinkedIn/Log | Weekly | Milestones, achievements, stats |

## Key Features

### Intelligent Monitoring
- Pattern recognition for common issues
- Baseline learning for normal behavior
- Anomaly detection
- Predictive alerts

### Human-in-the-Loop
- Risk assessment for all actions
- Approval workflow for medium/high risk changes
- Email/WhatsApp approval requests
- 30-minute timeout with escalation

### Multi-Agent Coordination
- Specialized agents for different tasks
- GPT-4 orchestration
- Tool use pattern implementation
- Exception handling

### Learning & Improvement
- Problem history tracking
- Solution effectiveness metrics
- Pattern library expansion
- Monthly performance reports

## Metrics & ROI

### Time Saved (Target)
- Manual monitoring: 5 hours/week → 0.5 hours/week
- Troubleshooting: 3 hours/week → 0.5 hours/week
- False alarm investigation: 2 hours/week → 0 hours/week
- **Total: 9.5 hours/week saved**

### Targets
- Uptime: 99.5%+
- MTTR (Mean Time To Resolution): < 15 minutes
- Auto-fix Success Rate: 80%+
- False Positive Rate: < 5%

### Cost
- Self-hosted n8n: $0/month (Docker on existing hardware)
- OpenAI API (GPT-4): ~$10-20/month
- WhatsApp Business API: ~$0-10/month
- **Total: $10-30/month**

### ROI
- **Monthly savings**: $1,900 (in developer time)
- **Annual savings**: $22,800
- **Net benefit**: $22,500+/year

## Security

- All credentials stored in n8n encrypted credential store
- API keys rotate every 90 days
- Audit log for all actions
- Human approval required for destructive operations
- Network isolation for sensitive services

## Contributing

Terry is an internal tool, but workflows and scripts are shared for:
- Educational purposes (building in public)
- Client demonstrations
- Course materials

## Support

For issues or questions:
- Internal: Slack #terry-agent channel
- Documentation: This repository
- Emergency: Contact DevOps team

## Related Projects

- [Agentic Schemas](https://github.com/Ai-Whisperers/agentic-schemas) - 20 design patterns Terry uses
- [Infrastructure Hub](https://github.com/Ai-Whisperers/Company-Information) - GitHub organization management
- [Work Hours Automation](https://github.com/Ai-Whisperers/work-hours-automated-reports) - Time tracking automation

## License

Internal use only - AI-Whisperers proprietary.

## Version

Current: v1.0.0 (Month 1 - Core Implementation)

---

**Built with transparency by AI-Whisperers | Paraguay → Global**

*"We teach what we learn, we build what we teach"*

