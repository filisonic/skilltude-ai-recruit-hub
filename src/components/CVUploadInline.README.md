# CVUploadInline Component

## Overview

The `CVUploadInline` component is a compact, visually appealing CV upload section designed for integration into the careers page. It provides a streamlined way for job seekers to submit their CVs for free professional analysis while browsing job listings.

## Features

- **Compact Layout**: Two-column design optimized for inline placement
- **Value Proposition**: Left panel with gradient background highlighting key benefits
- **Embedded Form**: Right panel contains the full CVUploadForm component
- **Mobile Responsive**: Stacks vertically on mobile devices for optimal viewing
- **Visual Appeal**: Gradient backgrounds and modern design matching site aesthetics

## Usage

```tsx
import CVUploadInline from '@/components/CVUploadInline';

function CareersPage() {
  const handleSuccess = (submissionId: string) => {
    console.log('CV submitted successfully:', submissionId);
  };

  const handleError = (error: Error) => {
    console.error('CV submission failed:', error);
  };

  return (
    <div>
      <CVUploadInline 
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSuccess` | `(submissionId: string) => void` | No | Callback function called when CV is successfully submitted |
| `onError` | `(error: Error) => void` | No | Callback function called when submission fails |

## Design Specifications

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌──────────────┬────────────────────────────────────┐ │
│  │              │                                    │ │
│  │  Value Prop  │         CV Upload Form            │ │
│  │  (40% width) │         (60% width)               │ │
│  │              │                                    │ │
│  │  - Benefits  │  - File Upload                    │ │
│  │  - Features  │  - Personal Info                  │ │
│  │  - CTA       │  - Submit Button                  │ │
│  │              │                                    │ │
│  └──────────────┴────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Color Scheme

- **Gradient Background**: `from-teal-600 via-cyan-600 to-orange-500`
- **Border**: `border-teal-100`
- **Text**: White on gradient, dark gray on white background
- **Accents**: Teal and orange highlights

### Responsive Behavior

- **Desktop (lg+)**: Two-column layout (2:3 ratio)
- **Tablet/Mobile**: Single column, stacked vertically
- **Padding**: Responsive padding (8-10 units)

## Key Benefits Displayed

1. **ATS Optimized**
   - Icon: FileCheck
   - Description: Pass automated screening systems

2. **Expert Feedback**
   - Icon: TrendingUp
   - Description: Detailed analysis within 24-48 hours

3. **100% Free**
   - Icon: Sparkles
   - Description: No credit card or payment required

## Integration Points

### Careers Page Integration

The component is positioned above the job listings section on the careers page:

```tsx
// In Careers.tsx
<CVUploadInline />
{/* Search and Filters */}
{/* Job Listings */}
```

This placement ensures:
- High visibility for job seekers
- Natural flow from CV analysis to job applications
- Non-intrusive design that complements job listings

## Styling

The component uses:
- **Tailwind CSS** for all styling
- **Lucide React** icons for visual elements
- **Gradient backgrounds** for visual appeal
- **Rounded corners** (rounded-3xl) for modern look
- **Shadow effects** for depth

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Icon labels for screen readers
- Keyboard navigation support (inherited from CVUploadForm)
- Mobile-friendly touch targets

## Requirements Satisfied

This component satisfies the following requirements from the CV Analysis System spec:

- **Requirement 1.1**: CV upload interface with clear value proposition
- **Requirement 8.2**: CV upload form positioned prominently on careers page
- **Requirement 8.5**: Responsive design for mobile and desktop

## Related Components

- **CVUploadForm**: The core form component embedded in this inline version
- **CVUploadHero**: Full-page hero version for homepage
- **Careers Page**: Parent page where this component is integrated

## Testing

To test the component:

1. Navigate to the careers page
2. Verify the component appears above job listings
3. Test form submission with valid CV file
4. Verify responsive behavior on mobile devices
5. Check that success/error callbacks work correctly

## Future Enhancements

Potential improvements:
- A/B testing different value propositions
- Dynamic benefit content based on user behavior
- Integration with job application tracking
- Personalized messaging based on viewed jobs
