# Design Document

## Overview

This design addresses the header overlap issue by implementing a consistent layout system that properly accounts for the fixed header positioning. The solution involves creating a reusable layout wrapper component and updating existing pages to use proper spacing.

## Architecture

### Current Problem Analysis
- Header uses `fixed` positioning with `z-50` and variable height (20px when scrolled, 16px when not)
- Pages start their content at the top of the viewport, causing overlap with the fixed header
- No consistent system for handling header spacing across pages

### Proposed Solution
1. Create a `PageLayout` wrapper component that handles header spacing automatically
2. Update existing pages to use the new layout component
3. Implement CSS custom properties for dynamic header height management

## Components and Interfaces

### PageLayout Component
```typescript
interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}
```

**Responsibilities:**
- Automatically apply correct top padding/margin to account for header
- Handle responsive spacing for mobile and desktop
- Provide consistent layout structure across all pages

### Header Component Updates
**Current State:** Variable height based on scroll state
**Proposed Changes:** Export header height values as CSS custom properties

## Data Models

### CSS Custom Properties
```css
:root {
  --header-height-default: 80px; /* 20 * 0.25rem */
  --header-height-scrolled: 64px; /* 16 * 0.25rem */
}
```

### Layout Classes
```css
.page-content {
  padding-top: var(--header-height-default);
  transition: padding-top 300ms ease;
}

.page-content--scrolled {
  padding-top: var(--header-height-scrolled);
}
```

## Implementation Strategy

### Phase 1: Create Layout Infrastructure
1. Create `PageLayout` component with proper header spacing
2. Implement CSS custom properties for header heights
3. Add scroll detection for dynamic height adjustment

### Phase 2: Update Existing Pages
1. Wrap existing page content with `PageLayout` component
2. Remove any manual spacing that conflicts with the new system
3. Test across different viewport sizes

### Phase 3: Responsive Considerations
1. Ensure mobile menu doesn't interfere with content positioning
2. Handle edge cases for very small screens
3. Verify smooth transitions between scroll states

## Error Handling

### Fallback Mechanisms
- Default to safe padding values if CSS custom properties aren't supported
- Graceful degradation for older browsers
- Fallback spacing for JavaScript-disabled environments

### Edge Cases
- Handle pages with custom header requirements
- Account for potential header height changes in future updates
- Ensure compatibility with existing custom CSS

## Testing Strategy

### Visual Regression Testing
- Screenshot comparison before/after implementation
- Test across multiple viewport sizes (mobile, tablet, desktop)
- Verify smooth scroll transitions

### Cross-Browser Testing
- Test in Chrome, Firefox, Safari, Edge
- Verify CSS custom property support
- Test fallback behavior in older browsers

### User Experience Testing
- Verify no content is hidden behind header
- Test scroll behavior and transitions
- Confirm mobile menu doesn't interfere with content

## Technical Decisions

### CSS Custom Properties vs Fixed Values
**Decision:** Use CSS custom properties for dynamic height management
**Rationale:** Allows for easy maintenance and future header modifications without touching multiple files

### Component Wrapper vs Global CSS
**Decision:** Create a reusable PageLayout component
**Rationale:** Provides better encapsulation, easier maintenance, and consistent implementation across pages

### Transition Handling
**Decision:** Match header transition duration (300ms) for content spacing
**Rationale:** Creates smooth, synchronized animations between header and content positioning