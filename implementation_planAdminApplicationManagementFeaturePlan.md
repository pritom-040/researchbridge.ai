# Admin Application Management Feature Plan

Currently, when users apply for scholarships, their applications are saved in the database but administrators do not have an interface to review them. This plan outlines how we will add an "Applications" page to the Admin Portal where you can view all submissions and explicitly approve or deny them.

## Proposed Changes

---

### 1. Backend API Updates

We will add two new protected routes that only users with the `ADMIN` role can access.

#### [MODIFY] apps/api/src/routes/adminRoutes.ts
- Expose `GET /api/admin/applications` to list all applications.
- Expose `PATCH /api/admin/applications/:id/status` to update an application's status.

#### [MODIFY] apps/api/src/controllers/adminController.ts
- Create `getAllApplications`: Fetches all applications in the database, including the associated Student Profile details (Name, Email) and Scholarship Details (Name).
- Create `updateApplicationStatus`: Takes an application ID and a new status (`ACCEPTED` or `REJECTED`) and updates it in the database.

---

### 2. Frontend Admin Portal Updates

We will build the UI for the admin to manage these applications.

#### [NEW] apps/web/app/(admin)/admin/applications/page.tsx
- Build a new data table/list to display incoming applications.
- It will show: Student Name, Scholarship Name, Applied Date, and Current Status.
- Add "Approve" (Green) and "Deny" (Red) buttons next to applications that are currently marked as `SUBMITTED`.
- When an admin clicks a button, it will hit our new API to update the status in real-time.

#### [MODIFY] apps/web/components/admin/AdminSidebar.tsx
- Add a new "Applications" link in the sidebar menu so you can easily navigate to this page.

## User Review Required
> [!NOTE]  
> Approving or denying an application will instantly update the status for the student on their own Dashboard timeline!

Click **Approve** if you are happy with this plan, and I will build the feature!
