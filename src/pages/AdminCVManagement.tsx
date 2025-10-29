import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  LogOut,
  User,
  FileText,
  BarChart3,
  List,
  Mail
} from 'lucide-react';
import CVSubmissionsList from '@/components/admin/CVSubmissionsList';
import CVSubmissionDetail from '@/components/admin/CVSubmissionDetail';
import CVAnalyticsDashboard from '@/components/admin/CVAnalyticsDashboard';
import EmailQueueMonitor from '@/components/admin/EmailQueueMonitor';

const AdminCVManagement = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'analytics' | 'email-queue'>('list');
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const adminUser = localStorage.getItem('admin_user');

    if (!isLoggedIn || !adminUser) {
      navigate('/admin/login');
      return;
    }

    setUser(JSON.parse(adminUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const handleViewDetails = (id: number) => {
    setSelectedSubmissionId(id);
  };

  const handleBackToList = () => {
    setSelectedSubmissionId(null);
    setActiveTab('list');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-500" />
                <h1 className="text-2xl font-bold text-gray-900">CV Management</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user.first_name} {user.last_name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {selectedSubmissionId ? (
          <CVSubmissionDetail 
            submissionId={selectedSubmissionId}
            onBack={handleBackToList}
            onUpdate={handleBackToList}
          />
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                Submissions List
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('email-queue')}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === 'email-queue'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email Queue
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'list' ? (
              <CVSubmissionsList onViewDetails={handleViewDetails} />
            ) : activeTab === 'analytics' ? (
              <CVAnalyticsDashboard />
            ) : (
              <EmailQueueMonitor />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCVManagement;
