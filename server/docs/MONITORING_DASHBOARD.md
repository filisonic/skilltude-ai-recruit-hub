# Monitoring Dashboard Documentation

## Overview

The System Monitoring Dashboard provides real-time insights into the CV Analysis System's performance, health, and usage metrics. It's designed for administrators to track system health, identify issues, and monitor key performance indicators.

## Features

### 1. Real-Time Metrics
- **Upload Metrics**: Total uploads, success rate, recent activity
- **Analysis Metrics**: Average scores, score distribution
- **Email Metrics**: Delivery rates, queue status
- **Storage Metrics**: File count, storage usage, available space

### 2. Health Monitoring
- Database connectivity status
- Storage accessibility
- Email service operational status
- System-wide health score

### 3. Trend Analysis
- 30-day activity trends
- Daily upload, analysis, and email patterns
- Historical performance data

### 4. Score Distribution
- Visual breakdown of CV quality scores
- Categories: Excellent (85-100), Good (70-84), Average (50-69), Poor (0-49)

## API Endpoints

### GET /api/monitoring/metrics
Get comprehensive system metrics.

**Authentication**: Required (Admin/Super Admin)

**Response**:
```json
{
  "success": true,
  "data": {
    "uploadMetrics": {
      "total": 1250,
      "successful": 1200,
      "failed": 50,
      "successRate": 96.0,
      "averageProcessingTime": 2500,
      "last24Hours": 45,
      "last7Days": 320,
      "last30Days": 1250
    },
    "analysisMetrics": {
      "total": 1200,
      "averageScore": 72.5,
      "averageProcessingTime": 1800,
      "scoreDistribution": {
        "excellent": 250,
        "good": 450,
        "average": 400,
        "poor": 100
      }
    },
    "emailMetrics": {
      "queued": 15,
      "sent": 1150,
      "failed": 35,
      "retrying": 5,
      "deliveryRate": 97.0,
      "averageDeliveryTime": 86400000
    },
    "storageMetrics": {
      "totalFiles": 1200,
      "totalSize": 5368709120,
      "averageFileSize": 4473924,
      "availableSpace": 10737418240,
      "usagePercentage": 50.0
    },
    "apiMetrics": {
      "totalRequests": 15000,
      "averageResponseTime": 250,
      "errorRate": 0.5,
      "rateLimitHits": 12
    },
    "timestamp": "2024-12-25T10:30:00Z"
  }
}
```

### GET /api/monitoring/timeseries
Get time series data for trend charts.

**Authentication**: Required (Admin/Super Admin)

**Query Parameters**:
- `days` (optional): Number of days to retrieve (1-365, default: 30)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-12-01",
      "uploads": 42,
      "analyses": 40,
      "emailsSent": 38
    },
    {
      "date": "2024-12-02",
      "uploads": 38,
      "analyses": 37,
      "emailsSent": 35
    }
  ]
}
```

### GET /api/monitoring/errors
Get recent errors from logs.

**Authentication**: Required (Admin/Super Admin)

**Query Parameters**:
- `limit` (optional): Number of errors to retrieve (1-500, default: 50)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2024-12-25T10:25:00Z",
      "level": "error",
      "message": "Failed to send email",
      "category": "email_delivery",
      "error": "SMTP connection timeout"
    }
  ]
}
```

### GET /api/monitoring/health
Get system health status.

**Authentication**: Required (Admin/Super Admin)

**Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "checks": {
      "database": true,
      "storage": true,
      "email": true
    },
    "issues": []
  }
}
```

**Health Status Values**:
- `healthy`: All systems operational
- `degraded`: One minor issue detected
- `unhealthy`: Multiple issues or critical failure

### GET /api/monitoring/performance
Get performance metrics.

**Authentication**: Required (Admin/Super Admin)

**Response**:
```json
{
  "success": true,
  "data": {
    "avgUploadTime": 2500,
    "avgAnalysisTime": 1800,
    "avgEmailDeliveryTime": 86400000,
    "slowestOperations": [
      {
        "operation": "cv_analysis",
        "duration": 5000,
        "timestamp": "2024-12-25T10:20:00Z"
      }
    ]
  }
}
```

## Frontend Component

### SystemMonitoringDashboard

React component that displays the monitoring dashboard.

**Location**: `src/components/admin/SystemMonitoringDashboard.tsx`

**Features**:
- Auto-refresh every 30 seconds (toggleable)
- Real-time health status badge
- Interactive charts using Recharts
- Responsive design for mobile and desktop
- Tab-based navigation for different views

**Usage**:
```tsx
import { SystemMonitoringDashboard } from '@/components/admin/SystemMonitoringDashboard';

function AdminPage() {
  return (
    <div>
      <SystemMonitoringDashboard />
    </div>
  );
}
```

## Metrics Tracked

### Upload Success/Failure Rate
- **Purpose**: Monitor upload reliability
- **Alert Threshold**: < 95% success rate
- **Action**: Check file storage, validation logic, rate limiting

### Average Analysis Score
- **Purpose**: Track overall CV quality trends
- **Normal Range**: 60-80
- **Action**: If declining, review analysis algorithm

### Email Delivery Rate
- **Purpose**: Ensure emails reach users
- **Alert Threshold**: < 90% delivery rate
- **Action**: Check SMTP configuration, email queue processing

### Storage Usage
- **Purpose**: Prevent disk space issues
- **Alert Threshold**: > 80% usage
- **Action**: Archive old files, increase storage capacity

### API Response Time
- **Purpose**: Monitor system performance
- **Alert Threshold**: > 1000ms average
- **Action**: Optimize queries, add caching, scale infrastructure

## Monitoring Best Practices

### 1. Regular Review
- Check dashboard daily
- Review weekly trends
- Investigate anomalies immediately

### 2. Set Up Alerts
- Configure alerts for critical thresholds
- Use email/SMS notifications for urgent issues
- Integrate with monitoring services (PagerDuty, Opsgenie)

### 3. Capacity Planning
- Monitor growth trends
- Plan for storage expansion
- Scale infrastructure proactively

### 4. Performance Optimization
- Identify slow operations
- Optimize database queries
- Implement caching where appropriate

### 5. Security Monitoring
- Track failed authentication attempts
- Monitor rate limit violations
- Review access logs regularly

## Troubleshooting

### Dashboard Not Loading
1. Check authentication status
2. Verify admin role permissions
3. Check browser console for errors
4. Verify API endpoints are accessible

### Metrics Not Updating
1. Check auto-refresh toggle
2. Verify database connectivity
3. Check server logs for errors
4. Ensure monitoring service is running

### Inaccurate Metrics
1. Verify database data integrity
2. Check log file accessibility
3. Review metric calculation logic
4. Ensure timezone consistency

### Health Check Failures
1. **Database**: Check MySQL connection, credentials
2. **Storage**: Verify directory permissions, disk space
3. **Email**: Test SMTP configuration, check queue processing

## Integration with External Services

### CloudWatch (AWS)
```typescript
// Example: Send metrics to CloudWatch
import AWS from 'aws-sdk';

const cloudwatch = new AWS.CloudWatch();

async function sendMetricsToCloudWatch(metrics: SystemMetrics) {
  await cloudwatch.putMetricData({
    Namespace: 'CVAnalysisSystem',
    MetricData: [
      {
        MetricName: 'UploadSuccessRate',
        Value: metrics.uploadMetrics.successRate,
        Unit: 'Percent',
      },
      {
        MetricName: 'EmailDeliveryRate',
        Value: metrics.emailMetrics.deliveryRate,
        Unit: 'Percent',
      },
    ],
  }).promise();
}
```

### Datadog
```typescript
// Example: Send metrics to Datadog
import { StatsD } from 'node-dogstatsd';

const dogstatsd = new StatsD();

function sendMetricsToDatadog(metrics: SystemMetrics) {
  dogstatsd.gauge('cv_system.uploads.success_rate', metrics.uploadMetrics.successRate);
  dogstatsd.gauge('cv_system.email.delivery_rate', metrics.emailMetrics.deliveryRate);
  dogstatsd.gauge('cv_system.storage.usage_percent', metrics.storageMetrics.usagePercentage);
}
```

### Prometheus
```typescript
// Example: Expose metrics for Prometheus
import { register, Gauge } from 'prom-client';

const uploadSuccessRate = new Gauge({
  name: 'cv_system_upload_success_rate',
  help: 'Upload success rate percentage',
});

const emailDeliveryRate = new Gauge({
  name: 'cv_system_email_delivery_rate',
  help: 'Email delivery rate percentage',
});

// Update metrics
uploadSuccessRate.set(metrics.uploadMetrics.successRate);
emailDeliveryRate.set(metrics.emailMetrics.deliveryRate);

// Expose /metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

## Future Enhancements

1. **Alerting System**: Automated alerts for threshold violations
2. **Predictive Analytics**: ML-based capacity forecasting
3. **Custom Dashboards**: User-configurable metric views
4. **Export Functionality**: Download metrics as CSV/PDF
5. **Comparative Analysis**: Compare metrics across time periods
6. **Real-time Notifications**: WebSocket-based live updates
7. **Mobile App**: Native mobile monitoring app
8. **API Rate Limiting Dashboard**: Detailed rate limit analytics

## Security Considerations

### Access Control
- Only admin and super_admin roles can access monitoring endpoints
- All endpoints require authentication
- Rate limiting applied to prevent abuse

### Data Privacy
- Metrics are aggregated and anonymized
- No PII exposed in monitoring data
- Audit logs track who accessed monitoring data

### Performance Impact
- Metrics collection is optimized for minimal overhead
- Database queries use indexes
- Caching implemented for frequently accessed data
- Auto-refresh can be disabled to reduce load

## Conclusion

The Monitoring Dashboard is a critical tool for maintaining system health and performance. Regular monitoring, combined with proactive alerting and capacity planning, ensures the CV Analysis System remains reliable and performant for all users.
