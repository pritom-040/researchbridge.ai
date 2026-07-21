# Scholarship Application Feature Implementation Plan

You've noticed that the "Apply Now" button on the scholarship detail page currently does nothing. To make it fully functional, we need to wire it up to the database so that clicking it officially registers your application.

Here is my plan to build this feature end-to-end.

## Proposed Changes

---

### 1. Backend: Application Controller & Routes
We will build a new API endpoint to handle the application submission.

#### [NEW] apps/api/src/controllers/applicationController.ts
- Create `applyForScholarship` function. This will:
  - Verify the user is authenticated and has a `StudentProfile`.
  - Check if the user has *already* applied for this scholarship to prevent duplicate applications.
  - Create a new `Application` record in the database linked to the student and the scholarship with a status of `SUBMITTED`.

#### [NEW] apps/api/src/routes/applicationRoutes.ts
- Create a new route file and register `POST /api/applications`.
- Protect the route with our `authenticateToken` middleware.

#### [MODIFY] apps/api/src/index.ts
- Import and register the new `applicationRoutes` under `/api/applications`.

---

### 2. Frontend: Button Integration
We will connect the "Apply Now" button to our new API and add user feedback.

#### [MODIFY] apps/web/app/(dashboard)/scholarships/[id]/page.tsx
- Add a new state variable `hasApplied` to track if the user has already submitted an application.
- Create a `handleApply` function that sends a `POST` request to `http://localhost:8000/api/applications` with the scholarship ID.
- Update the UI to show a loading spinner on the button while the request is processing.
- Once applied, change the button text to "Applied" and disable it so it cannot be clicked twice.
- Automatically check if the user has already applied when the page first loads, so the button correctly says "Applied" if they revisit the page later.

## User Review Required
> [!NOTE]  
> After applying, the new application will automatically show up in your Dashboard's "Active Applications" counter and timeline because we just made the dashboard fully dynamic!

Click **Approve** if this plan looks good, and I will build the feature immediately.
