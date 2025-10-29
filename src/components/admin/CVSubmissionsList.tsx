import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Calendar,
  Mail,
  Phone,
  Loader2,
  TrendingUp
} from 'lucide-react';

interface CVSubmission {
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
  convertedToPremium?: boolean;
  conversionDate?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface CVSubmissionsListProps {
  onViewDetails: (id: number) => void;
}

const CVSubmissionsList: React.FC<CVSubmissionsListProps> = ({ onViewDetails }) => {
  const [submissions, setSubmissions] = useState<CVSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  
  // New submissions count
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy: 'submitted_at',
        sortOrder: 'desc',
      });
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`/api/admin/cv-submissions?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch CV submissions');
      }
      
      const data = await response.json();
      
      setSubmissions(data.submissions);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      
      // Count new submissions
      const newSubmissions = data.submissions.filter((s: CVSubmission) => s.status === 'new');
      setNewCount(newSubmissions.length);
      
    } catch (err) {
      console.error('Error fetching CV submissions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleDownload = async (id: number, firstName: string, lastName: string) => {
    try {
      const response = await fetch(`/api/admin/cv-submissions/${id}/download`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to download CV');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${firstName}_${lastName}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading CV:', err);
      alert('Failed to download CV. Please try again.');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'destructive';
      case 'reviewed':
        return 'default';
      case 'contacted':
        return 'secondary';
      case 'hired':
        return 'default';
      case 'rejected':
        return 'outline';
      default:
        return 'secondary';
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">CV Submissions</h2>
          {newCount > 0 && (
            <Badge className="bg-red-500 text-white text-xs">
              {newCount} New
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-none">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="contacted">Contacted</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {submissions.length} of {total} submissions
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error loading submissions</p>
          <p className="text-sm">{error}</p>
          <Button 
            onClick={fetchSubmissions} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Submissions List */}
      {!loading && !error && (
        <>
          {submissions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No CV submissions have been received yet'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                          {submission.firstName} {submission.lastName}
                        </h3>
                        <Badge className={`${getStatusColor(submission.status)} text-xs`}>
                          {submission.status}
                        </Badge>
                        {submission.analysisScore !== undefined && submission.analysisScore !== null && (
                          <Badge variant="outline" className="font-mono text-xs">
                            Score: {submission.analysisScore}/100
                          </Badge>
                        )}
                        {submission.convertedToPremium && (
                          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 text-xs">
                            <TrendingUp className="w-3 h-3" />
                            Converted
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{submission.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{submission.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:col-span-2">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-xs">Submitted: {formatDate(submission.submittedAt)}</span>
                        </div>
                        {submission.reviewedAt && (
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs">Reviewed: {formatDate(submission.reviewedAt)}</span>
                          </div>
                        )}
                      </div>
                      
                      {submission.reviewedBy && (
                        <div className="text-xs text-gray-500">
                          Reviewed by: {submission.reviewedBy}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(submission.id, submission.firstName, submission.lastName)}
                        title="Download CV"
                        className="flex-1 sm:flex-none h-9"
                      >
                        <Download className="w-4 h-4 sm:mr-0" />
                        <span className="sm:hidden ml-2">Download</span>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onViewDetails(submission.id)}
                        className="bg-blue-500 hover:bg-blue-600 flex-1 sm:flex-none h-9"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200">
              <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-9"
                >
                  <ChevronLeft className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4 sm:ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CVSubmissionsList;
