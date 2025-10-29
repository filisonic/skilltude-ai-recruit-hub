# CV Management Component Hierarchy

## Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     AdminCVManagement Page                       │
│                  (src/pages/AdminCVManagement.tsx)               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                        Header                               │ │
│  │  • Back to Dashboard Link                                  │ │
│  │  • Page Title: "CV Management"                             │ │
│  │  • User Info + Logout Button                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Main Content Area                        │ │
│  │                                                             │ │
│  │  Conditional Rendering:                                    │ │
│  │                                                             │ │
│  │  IF selectedSubmissionId === null:                         │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         CVSubmissionsList Component                   │ │ │
│  │  │  (src/components/admin/CVSubmissionsList.tsx)         │ │ │
│  │  │                                                        │ │ │
│  │  │  ┌──────────────────────────────────────────────┐    │ │ │
│  │  │  │  Header Section                              │    │ │ │
│  │  │  │  • Title: "CV Submissions"                   │    │ │ │
│  │  │  │  • New Badge (if newCount > 0)               │    │ │ │
│  │  │  │  • Search Input                              │    │ │ │
│  │  │  │  • Status Filter Dropdown                    │    │ │ │
│  │  │  └──────────────────────────────────────────────┘    │ │ │
│  │  │                                                        │ │ │
│  │  │  ┌──────────────────────────────────────────────┐    │ │ │
│  │  │  │  Results Summary                             │    │ │ │
│  │  │  │  "Showing X of Y submissions"                │    │ │ │
│  │  │  └──────────────────────────────────────────────┘    │ │ │
│  │  │                                                        │ │ │
│  │  │  ┌──────────────────────────────────────────────┐    │ │ │
│  │  │  │  Submissions List                            │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  For each submission:                        │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  Submission Card                       │ │    │ │ │
│  │  │  │  │  • Name + Status Badge                 │ │    │ │ │
│  │  │  │  │  • Email, Phone                        │ │    │ │ │
│  │  │  │  │  • Submitted Date                      │ │    │ │ │
│  │  │  │  │  • Analysis Score (if available)       │ │    │ │ │
│  │  │  │  │  • Download Button                     │ │    │ │ │
│  │  │  │  │  • View Details Button                 │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  └──────────────────────────────────────────────┘    │ │ │
│  │  │                                                        │ │ │
│  │  │  ┌──────────────────────────────────────────────┐    │ │ │
│  │  │  │  Pagination Controls                         │    │ │ │
│  │  │  │  • Previous Button                           │    │ │ │
│  │  │  │  • Page Numbers (1, 2, 3, 4, 5)              │    │ │ │
│  │  │  │  • Next Button                               │    │ │ │
│  │  │  └──────────────────────────────────────────────┘    │ │ │
│  │  │                                                        │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ELSE (selectedSubmissionId !== null):                    │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         CVSubmissionDetail Component                  │ │ │
│  │  │  (src/components/admin/CVSubmissionDetail.tsx)        │ │ │
│  │  │                                                        │ │ │
│  │  │  ┌──────────────────────────────────────────────┐    │ │ │
│  │  │  │  Header Section                              │    │ │ │
│  │  │  │  • Back to List Button                       │    │ │ │
│  │  │  │  • Candidate Name                            │    │ │ │
│  │  │  │  • Submission UUID                           │    │ │ │
│  │  │  │  • Download CV Button                        │    │ │ │
│  │  │  │  • Save Changes Button                       │    │ │ │
│  │  │  └──────────────────────────────────────────────┘    │ │ │
│  │  │                                                        │ │ │
│  │  │  ┌──────────────────────────────────────────────┐    │ │ │
│  │  │  │  Left Column (1/3 width)                     │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  Contact Information Card              │ │    │ │ │
│  │  │  │  │  • Email (clickable)                   │ │    │ │ │
│  │  │  │  │  • Phone (clickable)                   │ │    │ │ │
│  │  │  │  │  • CV Filename                         │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  Status Management Card                │ │    │ │ │
│  │  │  │  │  • Status Dropdown                     │ │    │ │ │
│  │  │  │  │  • Converted to Premium Checkbox       │ │    │ │ │
│  │  │  │  │  • Conversion Date (if applicable)     │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  Timeline Card                         │ │    │ │ │
│  │  │  │  │  • Submitted Date                      │ │    │ │ │
│  │  │  │  │  • Reviewed Date (if applicable)       │ │    │ │ │
│  │  │  │  │  • Email Sent Date (if applicable)     │ │    │ │ │
│  │  │  │  │  • Email Opened Date (if applicable)   │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  └──────────────────────────────────────────────┘    │ │ │
│  │  │                                                        │ │ │
│  │  │  ┌──────────────────────────────────────────────┐    │ │ │
│  │  │  │  Right Column (2/3 width)                    │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  CV Analysis Score Card                │ │    │ │ │
│  │  │  │  │  • Overall Score (large display)       │ │    │ │ │
│  │  │  │  │  • Overall Quality Progress Bar        │ │    │ │ │
│  │  │  │  │  • ATS Compatibility Progress Bar      │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  Section Completeness Card             │ │    │ │ │
│  │  │  │  │  • Contact Info ✓/✗                    │ │    │ │ │
│  │  │  │  │  • Summary ✓/✗                         │ │    │ │ │
│  │  │  │  │  • Experience ✓/✗                      │ │    │ │ │
│  │  │  │  │  • Education ✓/✗                       │ │    │ │ │
│  │  │  │  │  • Skills ✓/✗                          │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  Strengths Card                        │ │    │ │ │
│  │  │  │  │  • List of identified strengths        │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  Recommended Improvements Card         │ │    │ │ │
│  │  │  │  │  For each improvement:                 │ │    │ │ │
│  │  │  │  │  • Priority Badge (High/Med/Low)       │ │    │ │ │
│  │  │  │  │  • Category Badge                      │ │    │ │ │
│  │  │  │  │  • Issue Description                   │ │    │ │ │
│  │  │  │  │  • Suggestion                          │ │    │ │ │
│  │  │  │  │  • Example (if available)              │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  Admin Notes Card                      │ │    │ │ │
│  │  │  │  │  • Textarea for notes                  │ │    │ │ │
│  │  │  │  │  • Character limit note                │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │    │ │ │
│  │  │  │  │  Technical Details Card                │ │    │ │ │
│  │  │  │  │  • IP Address                          │ │    │ │ │
│  │  │  │  │  • User Agent                          │ │    │ │ │
│  │  │  │  └────────────────────────────────────────┘ │    │ │ │
│  │  │  │                                              │    │ │ │
│  │  │  └──────────────────────────────────────────────┘    │ │ │
│  │  │                                                        │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Props Flow

```
AdminCVManagement
  │
  ├─ State: selectedSubmissionId
  │
  ├─ CVSubmissionsList
  │   │
  │   ├─ Props:
  │   │   └─ onViewDetails: (id) => setSelectedSubmissionId(id)
  │   │
  │   └─ Internal State:
  │       ├─ submissions (from API)
  │       ├─ loading
  │       ├─ error
  │       ├─ searchTerm
  │       ├─ statusFilter
  │       ├─ currentPage
  │       └─ newCount
  │
  └─ CVSubmissionDetail
      │
      ├─ Props:
      │   ├─ submissionId: selectedSubmissionId
      │   ├─ onBack: () => setSelectedSubmissionId(null)
      │   └─ onUpdate: () => setSelectedSubmissionId(null)
      │
      └─ Internal State:
          ├─ submission (from API)
          ├─ loading
          ├─ saving
          ├─ error
          ├─ status
          ├─ adminNotes
          └─ convertedToPremium
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Actions                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Component Event Handlers                      │
│  • handleSearch()                                                │
│  • handleStatusFilter()                                          │
│  • handleViewDetails()                                           │
│  • handleDownload()                                              │
│  • handleSave()                                                  │
│  • handleBackToList()                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      State Updates                               │
│  • setSearchTerm()                                               │
│  • setStatusFilter()                                             │
│  • setSelectedSubmissionId()                                     │
│  • setStatus()                                                   │
│  • setAdminNotes()                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Calls (useEffect)                       │
│  • fetchSubmissions()                                            │
│  • fetchSubmissionDetail()                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API Endpoints                         │
│  • GET /api/admin/cv-submissions                                 │
│  • GET /api/admin/cv-submissions/:id                             │
│  • PUT /api/admin/cv-submissions/:id                             │
│  • GET /api/admin/cv-submissions/:id/download                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Database                                 │
│  • cv_submissions table                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Response Data                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Component Re-render                           │
│  • Display updated data                                          │
│  • Show loading/error states                                     │
│  • Update UI elements                                            │
└─────────────────────────────────────────────────────────────────┘
```

## Navigation Flow

```
Admin Dashboard (AdminDashboardEnhanced)
  │
  ├─ Click "CV Submissions" tab
  │   └─> Navigate to /admin/cv-management
  │
  ├─ Click CV Submissions stat card
  │   └─> Navigate to /admin/cv-management
  │
  └─ Click "View All CVs" button
      └─> Navigate to /admin/cv-management

CV Management Page (AdminCVManagement)
  │
  ├─ Initial State: List View
  │   │
  │   ├─ Click "View Details" on submission
  │   │   └─> Show Detail View (same page)
  │   │
  │   └─ Click "Back to Dashboard"
  │       └─> Navigate to /admin/dashboard
  │
  └─ Detail View State
      │
      ├─ Click "Back to List"
      │   └─> Show List View (same page)
      │
      ├─ Click "Save Changes"
      │   └─> Update submission → Show List View
      │
      └─ Click "Back to Dashboard" (header)
          └─> Navigate to /admin/dashboard
```

## State Management Strategy

### Local Component State
Each component manages its own state using React hooks:

**CVSubmissionsList:**
- `submissions`: Array of submission objects
- `loading`: Boolean for loading state
- `error`: String for error messages
- `searchTerm`: String for search input
- `statusFilter`: String for status filter
- `currentPage`: Number for pagination
- `totalPages`: Number for pagination
- `total`: Number of total submissions
- `newCount`: Number of new submissions

**CVSubmissionDetail:**
- `submission`: Full submission object
- `loading`: Boolean for loading state
- `saving`: Boolean for save operation
- `error`: String for error messages
- `status`: String for status dropdown
- `adminNotes`: String for notes textarea
- `convertedToPremium`: Boolean for checkbox

**AdminCVManagement:**
- `user`: Admin user object
- `selectedSubmissionId`: Number or null for view switching

### No Global State
- No Redux, Zustand, or Context API needed
- Each component is self-contained
- Props are used for parent-child communication
- API calls are made directly in components

## Styling Architecture

### Tailwind CSS Classes
- Utility-first approach
- Responsive modifiers (sm:, md:, lg:)
- State variants (hover:, focus:, disabled:)
- Custom color palette

### shadcn/ui Components
- Card, CardHeader, CardTitle, CardContent
- Button (variants: default, outline, ghost)
- Badge (variants: default, destructive, secondary, outline)
- Pre-styled and accessible

### Custom Styling
- Color-coded status badges
- Progress bars for scores
- Hover effects on cards
- Transition animations
- Responsive grid layouts

## Error Handling Strategy

### API Errors
1. Catch errors in try-catch blocks
2. Set error state with message
3. Display error UI with retry button
4. Log errors to console

### Loading States
1. Set loading state before API call
2. Show spinner or skeleton
3. Clear loading state after response
4. Disable interactive elements

### Validation
1. Client-side validation for forms
2. Server-side validation via API
3. Display validation errors inline
4. Prevent invalid submissions

### Network Errors
1. Handle fetch failures
2. Show user-friendly messages
3. Provide retry functionality
4. Maintain form state

## Performance Optimization

### Current Optimizations
- Pagination to limit data fetching
- Conditional rendering for views
- Efficient re-rendering with proper deps
- Lazy loading of detail view

### Future Optimizations
- Debounced search input
- Virtual scrolling for large lists
- Memoization of expensive calculations
- Caching of API responses
- Code splitting for routes

## Accessibility Features

### Keyboard Navigation
- Tab order follows visual flow
- Enter key submits forms
- Escape key closes modals
- Arrow keys for pagination

### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Alt text for icons
- Status announcements

### Visual Accessibility
- High contrast colors
- Clear focus indicators
- Readable font sizes
- Sufficient spacing

## Browser Compatibility

### Supported Browsers
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Polyfills
- Included via Vite build process
- Fetch API polyfill
- Promise polyfill
- Array methods polyfill

## Deployment Checklist

- [ ] Build passes without errors
- [ ] All TypeScript types are correct
- [ ] No console errors in browser
- [ ] API endpoints are accessible
- [ ] Authentication works correctly
- [ ] File downloads work
- [ ] Responsive design tested
- [ ] Cross-browser testing done
- [ ] Performance is acceptable
- [ ] Documentation is complete
