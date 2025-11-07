# Make CV Analysis Async - Quick Plan

## Current Flow (Slow):
1. User uploads CV
2. **Wait** for file storage
3. **Wait** for text extraction (~2 seconds)
4. **Wait** for CV analysis
5. **Wait** for database save
6. Show success message

**Total wait: ~3 seconds at 90% progress**

## New Flow (Fast):
1. User uploads CV
2. Store file + basic info in database
3. **Show success immediately** ✅
4. Queue CV for analysis (background job)
5. Analysis happens async
6. Results sent via email

**User wait: <1 second!**

## Changes Needed:

### 1. Server Route (`server/routes/cv.routes.ts`)
- Remove text extraction from upload endpoint
- Remove CV analysis from upload endpoint
- Just store file + user data
- Return success immediately
- Add CV to analysis queue

### 2. Create Background Job (`server/jobs/processCVAnalysis.ts`)
- New cron job (runs every 5 minutes)
- Finds CVs with `analysis_status = 'pending'`
- Extracts text
- Runs analysis
- Updates database
- Marks as `analysis_status = 'completed'`

### 3. Database Changes
Add column: `analysis_status` ENUM('pending', 'processing', 'completed', 'failed')

### 4. Benefits:
- ✅ Instant user feedback
- ✅ No waiting at 90%
- ✅ Better scalability (can process multiple CVs in parallel)
- ✅ Retry logic if analysis fails
- ✅ User gets results via email anyway

## Implementation Time: ~30 minutes

Would you like me to implement this?
