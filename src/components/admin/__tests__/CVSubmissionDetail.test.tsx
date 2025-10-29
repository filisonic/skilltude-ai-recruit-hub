/**
 * Component tests for CVSubmissionDetail
 * Tests detail view display, status updates, file download, and form interactions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CVSubmissionDetail from '../CVSubmissionDetail';

// Mock submission data
const mockSubmissionDetail = {
  id: 1,
  uuid: 'uuid-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  cvFilename: 'john_doe_cv.pdf',
  cvFilePath: '2024/12/uuid-123-john_doe_cv.pdf',
  status: 'new' as const,
  analysisScore: 85,
  analysisResults: {
    overallScore: 85,
    atsCompatibility: 90,
    strengths: [
      'Clear contact information',
      'Strong action verbs',
      'Quantifiable achievements',
    ],
    improvements: [
      {
        category: 'Professional Summary',
        priority: 'high' as const,
        issue: 'Missing professional summary',
        suggestion: 'Add a 3-4 sentence summary',
        example: 'Results-driven software engineer...',
      },
      {
        category: 'Skills',
        priority: 'medium' as const,
        issue: 'Limited technical skills listed',
        suggestion: 'Expand skills section',
      },
    ],
    sectionCompleteness: {
      contactInfo: true,
      summary: false,
      experience: true,
      education: true,
      skills: true,
    },
    detailedFeedback: 'Overall good CV with room for improvement',
    analyzedAt: '2024-12-01T10:00:00Z',
  },
  emailSentAt: '2024-12-01T12:00:00Z',
  emailOpenedAt: '2024-12-02T09:00:00Z',
  convertedToPremium: false,
  conversionDate: null,
  submittedAt: '2024-12-01T10:00:00Z',
  reviewedAt: null,
  reviewedBy: null,
  adminNotes: '',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
};

describe('CVSubmissionDetail Component', () => {
  const mockOnBack = vi.fn();
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    global.alert = vi.fn();
  });

  // ============================================================================
  // Detail View Display Tests
  // ============================================================================

  describe('Detail View Display', () => {
    it('should render loading state initially', () => {
      (global.fetch as any).mockImplementationOnce(() => new Promise(() => {}));

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      // Check for the loading spinner by class name
      const loadingSpinner = document.querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should display submission details after loading', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('+1234567890')).toBeInTheDocument();
      expect(screen.getByText('john_doe_cv.pdf')).toBeInTheDocument();
    });

    it('should display analysis score and progress bars', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('85')).toBeInTheDocument();
      });

      expect(screen.getByText('Overall Score')).toBeInTheDocument();
      expect(screen.getByText('85/100')).toBeInTheDocument();
      expect(screen.getByText('90/100')).toBeInTheDocument();
    });

    it('should display section completeness', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Section Completeness')).toBeInTheDocument();
      });

      expect(screen.getByText('Contact Info')).toBeInTheDocument();
      expect(screen.getByText('Summary')).toBeInTheDocument();
      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
    });

    it('should display strengths list', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Strengths')).toBeInTheDocument();
      });

      expect(screen.getByText('Clear contact information')).toBeInTheDocument();
      expect(screen.getByText('Strong action verbs')).toBeInTheDocument();
      expect(screen.getByText('Quantifiable achievements')).toBeInTheDocument();
    });

    it('should display improvements with priority badges', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Recommended Improvements')).toBeInTheDocument();
      });

      expect(screen.getByText('HIGH PRIORITY')).toBeInTheDocument();
      expect(screen.getByText('MEDIUM PRIORITY')).toBeInTheDocument();
      expect(screen.getByText('Missing professional summary')).toBeInTheDocument();
      expect(screen.getByText('Add a 3-4 sentence summary')).toBeInTheDocument();
      expect(screen.getByText('Limited technical skills listed')).toBeInTheDocument();
    });

    it('should display timeline information', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Timeline')).toBeInTheDocument();
      });

      expect(screen.getByText('Submitted:')).toBeInTheDocument();
      expect(screen.getByText('Email Sent:')).toBeInTheDocument();
      expect(screen.getByText('Email Opened:')).toBeInTheDocument();
    });

    it('should display technical details', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Technical Details')).toBeInTheDocument();
      });

      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
      expect(screen.getByText('Mozilla/5.0...')).toBeInTheDocument();
    });

    it('should display error state on fetch failure', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading submission')).toBeInTheDocument();
      });

      expect(screen.getByText('Failed to fetch submission details')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Status Update Tests
  // ============================================================================

  describe('Status Updates', () => {
    it('should update status when dropdown is changed', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const statusSelect = screen.getByRole('combobox');
      await user.selectOptions(statusSelect, 'reviewed');

      expect(statusSelect).toHaveValue('reviewed');
    });

    it('should save status changes when Save button is clicked', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubmissionDetail,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submission: { ...mockSubmissionDetail, status: 'reviewed' },
          }),
        });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const statusSelect = screen.getByRole('combobox');
      await user.selectOptions(statusSelect, 'reviewed');

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/admin/cv-submissions/1',
          expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining('"status":"reviewed"'),
          })
        );
      });

      expect(global.alert).toHaveBeenCalledWith('Submission updated successfully!');
      expect(mockOnUpdate).toHaveBeenCalled();
    });

    it('should toggle converted to premium checkbox', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText('Converted to Premium Service');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it('should update admin notes', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const notesTextarea = screen.getByPlaceholderText('Add notes about this submission...');
      await user.type(notesTextarea, 'Test admin notes');

      expect(notesTextarea).toHaveValue('Test admin notes');
    });

    it('should display saving state when saving', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubmissionDetail,
        })
        .mockImplementationOnce(() => new Promise(() => {})); // Never resolves

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
      });
    });

    it('should handle save error', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubmissionDetail,
        })
        .mockResolvedValueOnce({
          ok: false,
        });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Failed to save changes. Please try again.');
      });
    });
  });

  // ============================================================================
  // File Download Tests
  // ============================================================================

  describe('File Download', () => {
    it('should download CV when download button is clicked', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubmissionDetail,
        })
        .mockResolvedValueOnce({
          ok: true,
          blob: async () => new Blob(['test'], { type: 'application/pdf' }),
        });

      // Mock URL.createObjectURL and revokeObjectURL
      const mockUrl = 'blob:mock-url';
      global.URL.createObjectURL = vi.fn(() => mockUrl);
      global.URL.revokeObjectURL = vi.fn();

      // Mock document.createElement and appendChild/removeChild
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      const originalCreateElement = document.createElement.bind(document);
      document.createElement = vi.fn((tag) => {
        if (tag === 'a') return mockLink as any;
        return originalCreateElement(tag);
      });
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const downloadButton = screen.getByText('Download CV');
      await user.click(downloadButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/admin/cv-submissions/1/download',
          expect.objectContaining({
            credentials: 'include',
          })
        );
      });

      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toBe('John_Doe_CV.pdf');
    });

    it('should handle download error', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSubmissionDetail,
        })
        .mockResolvedValueOnce({
          ok: false,
        });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const downloadButton = screen.getByText('Download CV');
      await user.click(downloadButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Failed to download CV. Please try again.');
      });
    });
  });

  // ============================================================================
  // Navigation Tests
  // ============================================================================

  describe('Navigation', () => {
    it('should call onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const backButton = screen.getByText('Back to List');
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Conditional Rendering Tests
  // ============================================================================

  describe('Conditional Rendering', () => {
    it('should not display reviewed info when not reviewed', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSubmissionDetail,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.queryByText('Reviewed:')).not.toBeInTheDocument();
    });

    it('should display reviewed info when reviewed', async () => {
      const reviewedSubmission = {
        ...mockSubmissionDetail,
        reviewedAt: '2024-12-03T10:00:00Z',
        reviewedBy: 'Admin User',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => reviewedSubmission,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Reviewed:')).toBeInTheDocument();
      });

      expect(screen.getByText('by Admin User')).toBeInTheDocument();
    });

    it('should display conversion date when converted', async () => {
      const convertedSubmission = {
        ...mockSubmissionDetail,
        convertedToPremium: true,
        conversionDate: '2024-12-05T10:00:00Z',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => convertedSubmission,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Converted on:/)).toBeInTheDocument();
      });
    });

    it('should not display analysis results when not available', async () => {
      const submissionWithoutAnalysis = {
        ...mockSubmissionDetail,
        analysisResults: undefined,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => submissionWithoutAnalysis,
      });

      render(
        <CVSubmissionDetail
          submissionId={1}
          onBack={mockOnBack}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.queryByText('CV Analysis Score')).not.toBeInTheDocument();
    });
  });
});
