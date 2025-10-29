import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft,
  Download,
  Save,
  Loader2,
  Mail,
  Phone,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react';

interface CVAnalysisResult {
  overallScore: number;
  atsCompatibility: number;
  strengths: string[];
  improvements: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    issue: string;
    suggestion: string;
    example?: string;
  }>;
  sectionCompleteness: {
    contactInfo: boolean;
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
  detailedFeedback: string;
  analyzedAt: Date | string;
}

interface CVSubmissionDetail {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cvFilename: string;
  cvFilePath: string;
  status: 'new' | 'reviewed' | 'contacted' | 'hired' | 'rejected';
  analysisScore?: number;
  analysisResults?: CVAnalysisResult;
  emailSentAt?: string;
  emailOpenedAt?: string;
  convertedToPremium: boolean;
  conversionDate?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  ipAddress: string;
  userAgent: string;
}

interface CVSubmissionDetailProps {
  submissionId: number;
  onBack: () => void;
  onUpdate?: () => void;
}

const CVSubmissionDetail: React.FC<CVSubmissionDetailProps> = ({ 
  submissionId, 
  onBack,
  onUpdate 
}) => {
  const [submission, setSubmission] = useState<CVSubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [status, setStatus] = useState<string>('new');
  const [adminNotes, setAdminNotes] = useState('');
  const [convertedToPremium, setConvertedToPremium] = useState(false);

  useEffect(() => {
    fetchSubmissionDetail();
  }, [submissionId]);

  const fetchSubmissionDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/cv-submissions/${submissionId}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch submission details');
      }
      
      const data = await response.json();
      setSubmission(data);
      setStatus(data.status);
      setAdminNotes(data.adminNotes || '');
      setConvertedToPremium(data.convertedToPremium || false);
      
    } catch (err) {
      console.error('Error fetching submission details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!submission) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/cv-submissions/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status,
          adminNotes,
          convertedToPremium,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update submission');
      }
      
      const data = await response.json();
      setSubmission(data.submission);
      
      // Show success message
      alert('Submission updated successfully!');
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (err) {
      console.error('Error updating submission:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!submission) return;
    
    try {
      const response = await fetch(`/api/admin/cv-submissions/${submissionId}/download`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to download CV');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${submission.firstName}_${submission.lastName}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading CV:', err);
      alert('Failed to download CV. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4" />;
      case 'low':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error loading submission</p>
          <p className="text-sm">{error || 'Submission not found'}</p>
          <Button 
            onClick={fetchSubmissionDetail} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" onClick={onBack} className="h-9 px-2 sm:px-4">
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to List</span>
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              {submission.firstName} {submission.lastName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate">Submission ID: {submission.uuid}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-1 sm:flex-none h-10"
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Download CV</span>
            <span className="sm:hidden">Download</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 flex-1 sm:flex-none h-10"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Info & Status */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                    {submission.email}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">
                    {submission.phone}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">CV File</label>
                <div className="flex items-center gap-2 mt-1">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700 truncate">{submission.cvFilename}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Current Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="contacted">Contacted</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Tracking */}
          <Card className={convertedToPremium ? 'border-green-300 bg-green-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 ${convertedToPremium ? 'text-green-600' : 'text-gray-500'}`} />
                Premium Conversion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {convertedToPremium ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Converted to Premium Service</span>
                  </div>
                  
                  {submission.conversionDate && (
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="text-sm text-gray-600">Conversion Date</div>
                      <div className="font-medium text-gray-900">{formatDate(submission.conversionDate)}</div>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConvertedToPremium(false)}
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Mark as Not Converted
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Mark this submission as converted when the candidate purchases premium CV services.
                  </p>
                  
                  <Button
                    onClick={() => setConvertedToPremium(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Converted
                  </Button>
                  
                  <p className="text-xs text-gray-500 italic">
                    This will record the conversion date and update analytics.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submission Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-600">Submitted:</span>
                <p className="text-gray-900">{formatDate(submission.submittedAt)}</p>
              </div>
              
              {submission.reviewedAt && (
                <div>
                  <span className="font-medium text-gray-600">Reviewed:</span>
                  <p className="text-gray-900">{formatDate(submission.reviewedAt)}</p>
                  {submission.reviewedBy && (
                    <p className="text-xs text-gray-500">by {submission.reviewedBy}</p>
                  )}
                </div>
              )}
              
              {submission.emailSentAt && (
                <div>
                  <span className="font-medium text-gray-600">Email Sent:</span>
                  <p className="text-gray-900">{formatDate(submission.emailSentAt)}</p>
                </div>
              )}
              
              {submission.emailOpenedAt && (
                <div>
                  <span className="font-medium text-gray-600">Email Opened:</span>
                  <p className="text-gray-900">{formatDate(submission.emailOpenedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Analysis Results & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* CV Analysis Results */}
          {submission.analysisResults && (
            <>
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                    CV Analysis Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="text-center sm:text-left">
                      <div className="text-4xl sm:text-5xl font-bold text-blue-600">
                        {submission.analysisResults.overallScore}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-1">Overall Score</div>
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="mb-3 sm:mb-2">
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span className="text-gray-600">Overall Quality</span>
                          <span className="font-medium">{submission.analysisResults.overallScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${submission.analysisResults.overallScore}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span className="text-gray-600">ATS Compatibility</span>
                          <span className="font-medium">{submission.analysisResults.atsCompatibility}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${submission.analysisResults.atsCompatibility}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Completeness */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Section Completeness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {Object.entries(submission.analysisResults.sectionCompleteness).map(([section, complete]) => (
                      <div key={section} className="flex items-center gap-2">
                        {complete ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm capitalize">
                          {section.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Strengths */}
              {submission.analysisResults.strengths && submission.analysisResults.strengths.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {submission.analysisResults.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Improvements */}
              {submission.analysisResults.improvements && submission.analysisResults.improvements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <TrendingUp className="w-5 h-5" />
                      Recommended Improvements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {submission.analysisResults.improvements.map((improvement, index) => (
                        <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`flex items-center gap-1 text-sm font-medium ${getPriorityColor(improvement.priority)}`}>
                              {getPriorityIcon(improvement.priority)}
                              {improvement.priority.toUpperCase()} PRIORITY
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {improvement.category}
                            </Badge>
                          </div>
                          <p className="font-medium text-gray-900 mb-1">{improvement.issue}</p>
                          <p className="text-sm text-gray-600 mb-2">{improvement.suggestion}</p>
                          {improvement.example && (
                            <div className="bg-gray-50 rounded p-2 text-sm text-gray-700 italic">
                              Example: {improvement.example}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this submission..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                These notes are only visible to administrators
              </p>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">IP Address:</span>
                <span className="ml-2 text-gray-900">{submission.ipAddress}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">User Agent:</span>
                <p className="text-gray-900 text-xs mt-1 break-all">{submission.userAgent}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CVSubmissionDetail;
