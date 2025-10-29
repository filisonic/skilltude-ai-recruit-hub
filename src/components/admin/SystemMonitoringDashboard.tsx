import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  HardDrive,
  Mail,
  TrendingUp,
  Upload,
  XCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SystemMetrics {
  uploadMetrics: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
  analysisMetrics: {
    total: number;
    averageScore: number;
    scoreDistribution: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
  };
  emailMetrics: {
    queued: number;
    sent: number;
    failed: number;
    retrying: number;
    deliveryRate: number;
  };
  storageMetrics: {
    totalFiles: number;
    totalSize: number;
    averageFileSize: number;
    usagePercentage: number;
  };
  timestamp: string;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: boolean;
    storage: boolean;
    email: boolean;
  };
  issues: string[];
}

interface TimeSeriesData {
  date: string;
  uploads: number;
  analyses: number;
  emailsSent: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export function SystemMonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    }
  };

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/monitoring/health', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch health status');
      }

      const data = await response.json();
      setHealth(data.data);
    } catch (err) {
      console.error('Failed to fetch health:', err);
    }
  };

  const fetchTimeSeries = async (days: number = 30) => {
    try {
      const response = await fetch(`/api/monitoring/timeseries?days=${days}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch time series data');
      }

      const data = await response.json();
      setTimeSeries(data.data);
    } catch (err) {
      console.error('Failed to fetch time series:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMetrics(), fetchHealth(), fetchTimeSeries()]);
      setLoading(false);
    };

    loadData();

    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(loadData, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500"><AlertTriangle className="w-3 h-3 mr-1" />Degraded</Badge>;
      case 'unhealthy':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Unhealthy</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!metrics) {
    return null;
  }

  const scoreDistributionData = [
    { name: 'Excellent (85-100)', value: metrics.analysisMetrics.scoreDistribution.excellent, color: COLORS[0] },
    { name: 'Good (70-84)', value: metrics.analysisMetrics.scoreDistribution.good, color: COLORS[1] },
    { name: 'Average (50-69)', value: metrics.analysisMetrics.scoreDistribution.average, color: COLORS[2] },
    { name: 'Poor (0-49)', value: metrics.analysisMetrics.scoreDistribution.poor, color: COLORS[3] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">System Monitoring</h2>
          <p className="text-muted-foreground">
            Last updated: {new Date(metrics.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Auto-refresh (30s)</span>
          </label>
          {health && getHealthBadge(health.status)}
        </div>
      </div>

      {/* Health Issues */}
      {health && health.issues.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>System Issues:</strong>
            <ul className="list-disc list-inside mt-2">
              {health.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uploadMetrics.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.uploadMetrics.successRate.toFixed(1)}% success rate
            </p>
            <div className="mt-2 text-xs">
              <div>Last 24h: {metrics.uploadMetrics.last24Hours}</div>
              <div>Last 7d: {metrics.uploadMetrics.last7Days}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.analysisMetrics.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.analysisMetrics.total} analyses completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Delivery</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.emailMetrics.deliveryRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.emailMetrics.sent} sent, {metrics.emailMetrics.failed} failed
            </p>
            <div className="mt-2 text-xs">
              <div>Queued: {metrics.emailMetrics.queued}</div>
              <div>Retrying: {metrics.emailMetrics.retrying}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(metrics.storageMetrics.totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.storageMetrics.totalFiles} files
            </p>
            <div className="mt-2 text-xs">
              <div>Avg size: {formatBytes(metrics.storageMetrics.averageFileSize)}</div>
              <div>Usage: {metrics.storageMetrics.usagePercentage.toFixed(1)}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Trends (Last 30 Days)</CardTitle>
              <CardDescription>Daily uploads, analyses, and emails sent</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="uploads" stroke="#3b82f6" name="Uploads" />
                  <Line type="monotone" dataKey="analyses" stroke="#10b981" name="Analyses" />
                  <Line type="monotone" dataKey="emailsSent" stroke="#f59e0b" name="Emails Sent" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CV Score Distribution</CardTitle>
              <CardDescription>Distribution of analysis scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health Checks</CardTitle>
              <CardDescription>Status of critical system components</CardDescription>
            </CardHeader>
            <CardContent>
              {health && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      <span>Database</span>
                    </div>
                    {health.checks.database ? (
                      <Badge className="bg-green-500">Connected</Badge>
                    ) : (
                      <Badge className="bg-red-500">Disconnected</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5" />
                      <span>Storage</span>
                    </div>
                    {health.checks.storage ? (
                      <Badge className="bg-green-500">Accessible</Badge>
                    ) : (
                      <Badge className="bg-red-500">Inaccessible</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      <span>Email Service</span>
                    </div>
                    {health.checks.email ? (
                      <Badge className="bg-green-500">Operational</Badge>
                    ) : (
                      <Badge className="bg-red-500">Issues Detected</Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
