# Admin Interface Component Tests

This directory contains comprehensive component tests for the CV Management admin interface.

## Test Files

### CVSubmissionsList.test.tsx
Tests for the CV submissions list component covering:
- **List Rendering**: Display of submissions, loading states, error states, empty states
- **Status Filtering**: Filtering submissions by status (new, reviewed, contacted, hired, rejected)
- **Search Functionality**: Searching submissions by name or email
- **Pagination**: Navigation between pages, page number display, button states
- **Action Buttons**: View details and download CV functionality
- **Results Summary**: Display of submission counts

### CVSubmissionDetail.test.tsx
Tests for the CV submission detail view component covering:
- **Detail View Display**: Rendering of submission details, analysis results, scores, strengths, improvements
- **Status Updates**: Changing submission status, updating admin notes, marking as converted to premium
- **File Download**: Downloading CV files with proper error handling
- **Navigation**: Back button functionality
- **Conditional Rendering**: Display of optional fields based on data availability

## Running Tests

### Run all component tests:
```bash
npm run test:components
```

### Run component tests in watch mode:
```bash
npm run test:components:watch
```

### Run specific test file:
```bash
npm run test:components -- CVSubmissionsList.test.tsx
```

## Test Coverage

The tests cover the following requirements from the spec:
- **Requirement 6.1**: List view with filtering and search
- **Requirement 6.2**: Status filtering and search functionality
- **Requirement 6.3**: Detail view display
- **Requirement 6.4**: File download functionality
- **Requirement 6.5**: Status updates and admin notes

## Test Structure

Each test file follows this structure:
1. **Setup**: Mock data and functions
2. **Test Suites**: Organized by functionality
3. **Individual Tests**: Specific scenarios with assertions
4. **Cleanup**: Automatic cleanup after each test

## Mocking Strategy

- **fetch API**: Mocked globally to simulate API responses
- **URL.createObjectURL**: Mocked for file download tests
- **document.createElement**: Mocked for download link creation
- **localStorage**: Mocked in setup.ts for authentication tests

## Known Issues

Some tests may fail when run together with server tests due to:
1. Different test environments (jsdom vs node)
2. Global mock conflicts
3. File system operations

To avoid these issues, run component tests separately using the dedicated script:
```bash
npm run test:components
```

## Future Improvements

- Add visual regression tests
- Add accessibility tests (ARIA labels, keyboard navigation)
- Add performance tests for large lists
- Add integration tests with real API endpoints
- Increase test coverage for edge cases
