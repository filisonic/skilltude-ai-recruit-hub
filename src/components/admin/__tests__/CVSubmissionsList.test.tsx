/**
 * Component tests for CVSubmissionsList
 * Tests list rendering, filtering, search, pagination, and download functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CVSubmissionsList from '../CVSubmissionsList';

// Mock data
const mockSubmissions = [
  {
    id: 1,
    uuid: 'uuid-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    cvFilename: 'john_doe_cv.pdf',
    cvFilePath: '2024/12/uuid-1-john_doe_cv.pdf',
    status: 'new' as const,
    analysisScore: 85,
    submittedAt: '2024-12-01T10:00:00Z',
    reviewedAt: null,
    reviewedBy: null,
  },
  {
    id: 2,
    uuid: 'uuid-2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    cvFilename: 'jane_smith_cv.pdf',
    cvFilePath: '2024/12/uuid-2-jane_smith_cv.pdf',
    status: 'reviewed' as const,
    analysisScore: 72,
    submittedAt: '2024-12-02T11:00:00Z',
    reviewedAt: '2024-12-03T09:00:00Z',
    reviewedBy: 'Admin User',
  },
  {
    id: 3,
    uuid: 'uuid-3',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1122334455',
    cvFilename: 'bob_johnson_cv.pdf',
    cvFilePath: '2024/12/uuid-3-bob_johnson_cv.pdf',
    status: 'contacted' as const,
    analysisScore: 90,
    submittedAt: '2024-12-03T12:00:00Z',
    reviewedAt: '2024-12-04T10:00:00Z',
    reviewedBy: 'Admin User',
  },
];

describe('CVSubmissionsList Component', () => {
  const mockOnViewDetails = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  // ============================================================================
  // List Rendering Tests
  // ============================================================================

  describe('List Rendering', () => {
    it('should render the component with title', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: [],
          total: 0,
          totalPages: 0,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      expect(screen.getByText('CV Submissions')).toBeInTheDocument();
    });

    it('should display loading state initially', () => {
      (global.fetch as any).mockImplementationOnce(() => new Promise(() => {}));

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      // Check for the loading spinner by class name
      const loadingSpinner = document.querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should render list of submissions after loading', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: mockSubmissions,
          total: 3,
          totalPages: 1,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should display submission details correctly', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: [mockSubmissions[0]],
          total: 1,
          totalPages: 1,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('+1234567890')).toBeInTheDocument();
      expect(screen.getByText('Score: 85/100')).toBeInTheDocument();
    });

    it('should display status badges with correct styling', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: mockSubmissions,
          total: 3,
          totalPages: 1,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const newBadge = screen.getByText('new');
      const reviewedBadge = screen.getByText('reviewed');
      const contactedBadge = screen.getByText('contacted');

      expect(newBadge).toBeInTheDocument();
      expect(reviewedBadge).toBeInTheDocument();
      expect(contactedBadge).toBeInTheDocument();
    });

    it('should display new submissions count badge', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: mockSubmissions,
          total: 3,
          totalPages: 1,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('1 New')).toBeInTheDocument();
      });
    });

    it('should display empty state when no submissions', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: [],
          total: 0,
          totalPages: 0,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('No submissions found')).toBeInTheDocument();
      });

      expect(screen.getByText('No CV submissions have been received yet')).toBeInTheDocument();
    });

    it('should display error state on fetch failure', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('Error loading submissions')).toBeInTheDocument();
      });

      expect(screen.getByText('Failed to fetch CV submissions')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Filtering Tests
  // ============================================================================

  describe('Status Filtering', () => {
    it('should filter submissions by status', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 3,
            totalPages: 1,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: [mockSubmissions[0]],
            total: 1,
            totalPages: 1,
          }),
        });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const statusFilter = screen.getByRole('combobox');
      await user.selectOptions(statusFilter, 'new');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('status=new'),
          expect.any(Object)
        );
      });
    });

    it('should reset to page 1 when changing filter', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          submissions: mockSubmissions,
          total: 3,
          totalPages: 1,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const statusFilter = screen.getByRole('combobox');
      await user.selectOptions(statusFilter, 'reviewed');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenLastCalledWith(
          expect.stringContaining('page=1'),
          expect.any(Object)
        );
      });
    });

    it('should display all statuses in filter dropdown', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: [],
          total: 0,
          totalPages: 0,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      const statusFilter = screen.getByRole('combobox');
      const options = within(statusFilter).getAllByRole('option');

      expect(options).toHaveLength(6); // All Status + 5 statuses
      expect(options[0]).toHaveTextContent('All Status');
      expect(options[1]).toHaveTextContent('New');
      expect(options[2]).toHaveTextContent('Reviewed');
      expect(options[3]).toHaveTextContent('Contacted');
      expect(options[4]).toHaveTextContent('Hired');
      expect(options[5]).toHaveTextContent('Rejected');
    });
  });

  // ============================================================================
  // Search Tests
  // ============================================================================

  describe('Search Functionality', () => {
    it('should search submissions by name or email', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 3,
            totalPages: 1,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: [mockSubmissions[0]],
            total: 1,
            totalPages: 1,
          }),
        });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search by name, email...');
      await user.type(searchInput, 'John');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('search=John'),
          expect.any(Object)
        );
      });
    });

    it('should reset to page 1 when searching', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          submissions: mockSubmissions,
          total: 3,
          totalPages: 1,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search by name, email...');
      await user.type(searchInput, 'test');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenLastCalledWith(
          expect.stringContaining('page=1'),
          expect.any(Object)
        );
      });
    });

    it('should display empty state with search message when no results', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 3,
            totalPages: 1,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: [],
            total: 0,
            totalPages: 0,
          }),
        });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search by name, email...');
      await user.type(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.getByText(/Try adjusting your search or filter criteria/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  // ============================================================================
  // Pagination Tests
  // ============================================================================

  describe('Pagination', () => {
    it('should display pagination controls when multiple pages', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: mockSubmissions,
          total: 50,
          totalPages: 3,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should navigate to next page', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 50,
            totalPages: 3,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 50,
            totalPages: 3,
          }),
        });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenLastCalledWith(
          expect.stringContaining('page=2'),
          expect.any(Object)
        );
      });
    });

    it('should navigate to previous page', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 50,
            totalPages: 3,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 50,
            totalPages: 3,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 50,
            totalPages: 3,
          }),
        });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });

      // Go to page 2 first
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });

      // Go back to page 1
      const prevButton = screen.getByText('Previous');
      await user.click(prevButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenLastCalledWith(
          expect.stringContaining('page=1'),
          expect.any(Object)
        );
      });
    });

    it('should disable previous button on first page', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: mockSubmissions,
          total: 50,
          totalPages: 3,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });

      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
    });

    it('should disable next button on last page', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 50,
            totalPages: 3,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 50,
            totalPages: 3,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            submissions: mockSubmissions,
            total: 50,
            totalPages: 3,
          }),
        });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      });

      // Navigate to last page
      let nextButton = screen.getByText('Next');
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      });
      
      nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
      });

      nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });

    it('should not display pagination for single page', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: mockSubmissions,
          total: 3,
          totalPages: 1,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // Action Button Tests
  // ============================================================================

  describe('Action Buttons', () => {
    it('should call onViewDetails when View Details button is clicked', async () => {
      const user = userEvent.setup();
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: [mockSubmissions[0]],
          total: 1,
          totalPages: 1,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const viewButton = screen.getByText('View Details');
      await user.click(viewButton);

      expect(mockOnViewDetails).toHaveBeenCalledWith(1);
    });

    it('should download CV when download button is clicked', async () => {
      const user = userEvent.setup();
      
      // Mock successful fetch for list
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: [mockSubmissions[0]],
          total: 1,
          totalPages: 1,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Mock successful download after component is rendered
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
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

      const downloadButtons = screen.getAllByRole('button');
      const downloadButton = downloadButtons.find(btn => btn.querySelector('svg'));
      
      if (downloadButton) {
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
      }
    });
  });

  // ============================================================================
  // Results Summary Tests
  // ============================================================================

  describe('Results Summary', () => {
    it('should display correct results count', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          submissions: mockSubmissions,
          total: 50,
          totalPages: 3,
        }),
      });

      render(<CVSubmissionsList onViewDetails={mockOnViewDetails} />);

      await waitFor(() => {
        expect(screen.getByText(/Showing 3 of 50 submissions/i)).toBeInTheDocument();
      });
    });
  });
});
