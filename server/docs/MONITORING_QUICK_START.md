# Monitoring & Logging Quick Start Guide

## 5-Minute Setup

### 1. Configure Environment Variables

Add to your `.env` file:

```bash
# Logging Level
LOG_LEVEL=info

# Alert Recipients (optional, for alerting)
ALERT_RECIPIENTS=admin@example.com

# SMTP for Alerts (optional, for alerting)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=alerts@skilltude.com
```

### 2. Start the Server

The logging system is automatically active when the server starts:

```bash
npm run server:dev
```

### 3. View Logs

Logs are automatically created in the `/logs` directory:

```bash
# View all logs
tail -f logs/combined.log

# View errors only
tail -f logs/error.log

# View CV operations
tail -f logs/cv-operations.log
```

### 4. Access Monitoring Dashboard

1. Log in to the admin panel
2. Navigate to the monitoring section
3. View real-time metrics and charts

Or access the API directly:

```bash
curl http://localhost:3000/api/monitoring/metrics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Start Alert Monitoring (Optional)

Run the alert scheduler to check for issues every 15 minutes:

```bash
npm run job:alerts:scheduler
```

## Common Tasks

### Check System Health

```bash
curl http://localhost:3000/api/monitoring/health \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View Recent Errors

```bash
# From logs
tail -n 50 logs/error.log

# From API
curl http://localhost:3000/api/monitoring/errors?limit=50 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Alert System

```bash
# Run alert check once
npm run job:alerts
```

### Change Log Level

Update `.env`:
```bash
LOG_LEVEL=debug  # For more detailed logs
LOG_LEVEL=error  # For errors only
```

Restart the server for changes to take effect.

## Production Deployment

### 1. Build the Server

```bash
npm run server:build
```

### 2. Start with PM2

```bash
# Start main server
pm2 start server/dist/index.js --name cv-server

# Start alert scheduler
pm2 start server/jobs/alertScheduler.js --name cv-alerts

# Save configuration
pm2 save

# Set up auto-start on boot
pm2 startup
```

### 3. Set Up Log Rotation (Optional)

PM2 handles log rotation automatically, but you can also use logrotate:

```bash
# Create /etc/logrotate.d/cv-analysis
/path/to/app/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    missingok
    copytruncate
}
```

## Monitoring Checklist

Daily:
- [ ] Check error.log for issues
- [ ] Review monitoring dashboard
- [ ] Verify alert emails are being received

Weekly:
- [ ] Review trend charts
- [ ] Check storage usage
- [ ] Analyze performance metrics

Monthly:
- [ ] Test alert system
- [ ] Review and tune thresholds
- [ ] Archive old logs

## Troubleshooting

### No Logs Appearing

1. Check if `/logs` directory exists
2. Verify LOG_LEVEL is set
3. Check disk space
4. Review file permissions

### Dashboard Not Loading

1. Verify you're logged in as admin
2. Check browser console for errors
3. Verify API endpoints are accessible
4. Check server logs for errors

### Alerts Not Sending

1. Verify SMTP configuration
2. Check ALERT_RECIPIENTS is set
3. Test SMTP connection
4. Review alert scheduler logs

## Next Steps

- Read [LOGGING_SYSTEM.md](./LOGGING_SYSTEM.md) for detailed logging documentation
- Read [MONITORING_DASHBOARD.md](./MONITORING_DASHBOARD.md) for dashboard features
- Read [ALERTING_SYSTEM.md](./ALERTING_SYSTEM.md) for alert configuration
- Review [TASK_17_MONITORING_LOGGING_SUMMARY.md](./TASK_17_MONITORING_LOGGING_SUMMARY.md) for complete implementation details

## Support

For issues or questions:
1. Check the documentation files listed above
2. Review server logs for error messages
3. Check the monitoring dashboard for system health
4. Contact your system administrator
