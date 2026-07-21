# Admin Portal: Manage Users & Scholarships Plan

You noticed that the links in the Admin sidebar for **Manage Users** and **Scholarships** currently don't do anything. This is because we only built the main dashboard overview! 

This plan outlines how we will build out the full functional pages for those sections so you can actually control the data on your platform.

## Proposed Changes

---

### 1. Backend: Admin Management APIs
We will add new secure endpoints specifically for administrators to perform actions on the database.

#### [MODIFY] apps/api/src/controllers/adminController.ts
- **`deleteUser`**: An endpoint to completely remove a user (and all their associated data) from the platform.
- **`getAllAdminScholarships`**: An endpoint to fetch all scholarships in a tabular format.
- **`deleteScholarship`**: An endpoint to delete a scholarship.

#### [MODIFY] apps/api/src/routes/adminRoutes.ts
- Register the new `DELETE /users/:id` and `DELETE /scholarships/:id` routes.

---

### 2. Frontend: Admin Pages
We will build out the UI for the two missing pages.

#### [MODIFY] apps/web/app/admin/layout.tsx
- Update the sidebar links to correctly point to `/admin/users` and `/admin/scholarships`. Ensure active state highlighting works.

#### [NEW] apps/web/app/admin/users/page.tsx
- A full-screen data table dedicated to managing users.
- Includes a red "Delete Account" button next to each user to permanently ban/remove them from the platform.

#### [NEW] apps/web/app/admin/scholarships/page.tsx
- A data table dedicated to viewing all scholarships in the system.
- Displays the scholarship name, university, funding type, and deadline.
- Includes a red "Delete" button to quickly remove outdated scholarships.

## User Review Required
> [!WARNING]
> Building "Delete" functionality gives you real power to wipe out data from your live database. Once you delete a user or a scholarship from these new pages, it cannot be undone!

## Open Questions
> [!NOTE]
> For this initial version, I am only planning to build **View** and **Delete** functionality (which is usually what admins need most). Do you also want the ability to **Edit/Add** new scholarships directly from the admin panel right now, or is View/Delete sufficient for this step?

Please click **Approve** if you are ready for me to build this out!
