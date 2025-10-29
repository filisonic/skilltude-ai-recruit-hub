/**
 * Email Queue Monitor Component
 * 
 * Displays email queue statistics and failed email deliveries for admin review
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Send,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailQueueStats {
  pending: number;
  queued: number;
  sent: number;
  failed: number;
  retrying: number;
}

interface EmailMetrics {
  sentLast24Hours: number;
  totalFailed: number;
  currentlyRetrying: number;
  dueNow: number;
  avgAttemptsForSuccess: string;
}

interface FailedEmail {
  id: number;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  emailAttempts: number;
  emailError: string;
  emailLastAttemptAt: string;
  emailScheduledAt: string;
  submittedAt: string;
  analysisScore: number;
}

export function EmailQueueMonitor() {
  const [stats, setStats] = useState<EmailQueueStats | null>(null);
  const [metrics, setMetrics] = useState<EmailMetrics | null>(null);
  const [failedEmails, setFailedEmails] = useState<FailedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [retryingId, setRetryingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch queue statistics
      const statsResponse = await fetch('/api/admin/cv-submissions/email-queue/stats', {
        credentials: 'include',
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to fetch queue statistics');
      }

      const statsData = await statsResponse.json();
      setStats(statsData.stats);
      setMetrics(statsData.metrics);

      // Fetch failed emails
      const failedResponse = await fetch('/api/admin/cv-submissions/email-queue/failed?limit=20', {
        credentials: 'include',
      });

      if (!failedResponse.ok) {
        throw new Error('Failed to fetch failed emails');
      }

      const failedData = await failedResponse.json();
      setFailedEmails(failedData.failedEmails);
    } catch (error) {
      console.error('Error fetching email queue data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email queue data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleProcessQueue = async () => {
    try {
      setProcessing(true);

      const response = await fetch('/api/admin/cv-submissions/email-queue/process', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to process queue');
      }

      const data = await response.json();

      toast({
        title: 'Queue Processed',
        description: `${data.result.sent} emails sent, ${data.result.failed} failed`,
      });

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error processing queue:', error);
      toast({
        title: 'Error',
        description: 'Failed to process email queue',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleRetryEmail = async (submissionId: number) => {
    try {
      setRetryingId(submissionId);

      const response = await fetch(`/api/admin/cv-submissions/${submissionId}/retry-email`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to retry email');
      }

      toast({
        title: 'Email Retry Successful',
        description: 'The email has been sent successfully',
      });

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error retrying email:', error);
      toast({
        title: 'Error',
        description: 'Failed to retry email delivery',
        variant: 'destructive',
      });
    } finally {
      setRetryingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const totalEmails = stats ? stats.pending + stats.queued + stats.sent + stats.failed + stats.retrying : 0;
  const successRate = totalEmails > 0 && stats ? ((stats.sent / totalEmails) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Queue Monitor</h2>
          <p className="text-gray-600">Track email delivery status and manage failed emails</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handleProcessQueue} 
            disabled={processing}
            size="sm"
          >
            {processing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Process Queue
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{stats?.pending || 0}</span>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Queued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{stats?.queued || 0}</span>
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{stats?.sent || 0}</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Retrying</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{stats?.retrying || 0}</span>
              <RefreshCw className="h-5 w-5 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{stats?.failed || 0}</span>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sent (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xl font-semibold">{metrics.sentLast24Hours}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Due Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-xl font-semibold">{metrics.dueNow}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xl font-semibold">{successRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-500" />
                <span className="text-xl font-semibold">{metrics.avgAttemptsForSuccess}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Failed Emails */}
      {failedEmails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Failed Email Deliveries</CardTitle>
            <CardDescription>
              Emails that failed after {3} retry attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {failedEmails.map((email) => (
                <div
                  key={email.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {email.firstName} {email.lastName}
                      </span>
                      <Badge variant="destructive">Failed</Badge>
                      {email.analysisScore && (
                        <Badge variant="outline">Score: {email.analysisScore}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{email.email}</p>
                    <p className="text-sm text-red-600 mb-2">
                      <strong>Error:</strong> {email.emailError}
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Attempts: {email.emailAttempts}</span>
                      <span>
                        Last Attempt: {new Date(email.emailLastAttemptAt).toLocaleString()}
                      </span>
                      <span>
                        Submitted: {new Date(email.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRetryEmail(email.id)}
                    disabled={retryingId === email.id}
                    size="sm"
                    variant="outline"
                  >
                    {retryingId === email.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {failedEmails.length === 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            No failed email deliveries. All emails are being delivered successfully!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default EmailQueueMonitor;
