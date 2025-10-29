import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle,
  Award,
  Calendar,
  Loader2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface OverallStats {
  totalSubmissions: number;
  newSubmissions: number;
  reviewedSubmissions: number;
  contactedSubmissions: number;
  hiredSubmissions: number;
  totalConversions: number;
  averageScore: number;
  conversionRate: number;
}

interface MonthlyStats {
  month: string;
  submissions: number;
  conversions: number;
  conversionRate: number;
  averageScore: number;
}

interface ConversionTimeline {
  date: string;
  conversions: number;
}

interface ScoreDistribution {
  scoreRange: string;
  count: number;
  conversions: number;
}

interface RecentConversion {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  analysisScore: number;
  conversionDate: string;
  submittedAt: string;
}

interface AnalyticsData {
  overall: OverallStats;
  monthly: MonthlyStats[];
  conversionTimeline: ConversionTimeline[];
  scoreDistribution: ScoreDistribution[];
  recentConversions: RecentConversion[];
}

const CVAnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/cv-submissions/analytics', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const analyticsData = await response.json();
      setData(analyticsData);
      
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-medium">Error loading analytics</p>
        <p className="text-sm">{error || 'No data available'}</p>
      </div>
    );
  }

  const { overall, monthly, scoreDistribution, recentConversions } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">CV Analytics Dashboard</h2>
        <p className="text-gray-600 mt-1">Track submissions, conversions, and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{overall.totalSubmissions}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="secondary" className="text-xs">
                {overall.newSubmissions} New
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Conversions</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{overall.totalConversions}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Premium Services
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {overall.conversionRate?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              {overall.conversionRate >= 10 ? (
                <><ArrowUp className="w-4 h-4 mr-1 text-green-600" /> Above target</>
              ) : (
                <><ArrowDown className="w-4 h-4 mr-1 text-orange-600" /> Below target</>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {overall.averageScore?.toFixed(1) || 0}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              Out of 100
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Trends (Last 12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Month</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Submissions</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Conversions</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Conv. Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {monthly.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No data available for the last 12 months
                    </td>
                  </tr>
                ) : (
                  monthly.map((month) => (
                    <tr key={month.month} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {formatMonth(month.month)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {month.submissions}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                        {month.conversions}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Badge 
                          variant={month.conversionRate >= 10 ? 'default' : 'secondary'}
                          className={month.conversionRate >= 10 ? 'bg-green-100 text-green-800' : ''}
                        >
                          {month.conversionRate?.toFixed(1) || 0}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {month.averageScore?.toFixed(1) || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreDistribution.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No score data available</p>
              ) : (
                scoreDistribution.map((range) => {
                  const conversionRate = range.count > 0 
                    ? ((range.conversions / range.count) * 100).toFixed(1)
                    : '0.0';
                  
                  return (
                    <div key={range.scoreRange} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{range.scoreRange}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">{range.count} CVs</span>
                          <span className="text-green-600 font-medium">
                            {range.conversions} conv ({conversionRate}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${(range.count / overall.totalSubmissions) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Conversions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Recent Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentConversions.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No conversions yet</p>
              ) : (
                recentConversions.map((conversion) => (
                  <div 
                    key={conversion.id} 
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {conversion.firstName} {conversion.lastName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{conversion.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Converted: {formatDate(conversion.conversionDate)}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Badge variant="outline" className="font-mono">
                        {conversion.analysisScore}/100
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{overall.newSubmissions}</p>
              <p className="text-sm text-gray-600 mt-1">New</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{overall.reviewedSubmissions}</p>
              <p className="text-sm text-gray-600 mt-1">Reviewed</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{overall.contactedSubmissions}</p>
              <p className="text-sm text-gray-600 mt-1">Contacted</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{overall.hiredSubmissions}</p>
              <p className="text-sm text-gray-600 mt-1">Hired</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{overall.totalConversions}</p>
              <p className="text-sm text-gray-600 mt-1">Converted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVAnalyticsDashboard;
