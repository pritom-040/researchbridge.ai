# Dynamic Dashboard Implementation Plan

You have correctly pointed out a major issue: the dashboard currently uses hardcoded placeholder data (e.g., "3 Active Applications", "85% Profile Completion") just to show how the design looks. Since we are building a real platform, this data needs to be 100% dynamic and pulled from your database. For a brand new user, these values should be `0`!

Here is my plan to replace the mock data with live database data.

## Proposed Changes

---

### 1. Backend: Dashboard Data API
We will build a new endpoint specifically designed to serve data to the dashboard in one fast request.

#### [MODIFY] apps/api/src/controllers/profileController.ts
- Create `getDashboardStats` function. This will:
  - Fetch the user's `Application` count from the database.
  - Fetch the user's `Bookmark` count (Saved Scholarships).
  - Calculate `Profile Completion %` dynamically by checking if `cgpa`, `major`, `testScores`, `skills`, and `researchInterests` are filled out in the database.
  - Fetch upcoming deadlines from the user's active applications for the Timeline.

#### [MODIFY] apps/api/src/routes/profileRoutes.ts
- Register the new `GET /api/profile/dashboard` endpoint and protect it with `authenticateToken`.

---

### 2. Frontend: Dynamic Dashboard Integration
We need to upgrade the static dashboard page into a dynamic React component.

#### [MODIFY] apps/web/app/(dashboard)/dashboard/page.tsx
- Add `"use client"` so we can fetch data on load.
- Add a `useEffect` hook to call `http://localhost:8000/api/profile/dashboard` upon login.
- Add a loading skeleton state so it looks professional while fetching data.
- Replace all hardcoded values (`3`, `12`, `85%`) with the real variables returned from the API.
- If the user has `0` applications or matches, display a clean "Empty State" message (e.g., "You have no active applications yet. Start exploring scholarships!").

## User Review Required
> [!IMPORTANT]  
> By making this dynamic, your dashboard will immediately look "empty" because you haven't applied to anything or saved anything yet in the database. I will add some "Explore" buttons to these empty states so the user knows what to do next.

Click **Approve** if you are ready for me to wire up the real data!
