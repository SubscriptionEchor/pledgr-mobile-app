# Role Management Context

This project implements a robust role management system to control user access, navigation, and permissions. Below is a detailed overview of how roles and permissions are handled, with explicit file paths for easy reference:

## 1. Role Definition
Roles are defined in the codebase as an enum in [`lib/enums.ts`](lib/enums.ts):

```ts
enum UserRole {
  MEMBER = 'member',
  CREATOR = 'creator',
  CREATOR_ASSOCIATE = 'creator_associate'
}
```

## 2. Role Storage and Setup
- The current user's role is stored in both React context ([`lib/context/AuthContext.tsx`](lib/context/AuthContext.tsx)) and in local storage (`AsyncStorage`) under the key `USER_ROLE`.
- When a user switches roles (e.g., from member to creator), the `updateUserRole` function (in [`lib/context/AuthContext.tsx`](lib/context/AuthContext.tsx)) is called. This updates the role in both context and storage, and redirects the user to the appropriate home screen for their new role.

## 3. Role Switching in the UI
- Users can switch roles via a dropdown in the profile sheet ([`components/ProfileSheet.tsx`](components/ProfileSheet.tsx)).
- Selecting a new role triggers `updateUserRole`, which updates the app state and navigates the user accordingly.

## 4. Role Checking (Access Control)
- The [`components/RoleProtectedRoute.tsx`](components/RoleProtectedRoute.tsx) component restricts access to certain pages based on the user's role.
- It checks if the current user's role is in the list of allowed roles. If not, an "Access Denied" message is shown.

## 5. Role in API Requests
- API requests include the current role as a header (`personatype`).
- This logic is implemented in [`lib/api/client.ts`](lib/api/client.ts).
- Depending on the role, a different token may be attached to the request for authentication and authorization.

## 6. Team Member Permissions
- There is a separate, more granular permission system for team members (e.g., view/edit per feature), managed in [`components/AddTeamMemberModal.tsx`](components/AddTeamMemberModal.tsx).
- This system allows assigning specific permissions to team members beyond the main user role system.

---

**Summary:**
- Roles are defined in an enum ([`lib/enums.ts`](lib/enums.ts)) and stored in both context ([`lib/context/AuthContext.tsx`](lib/context/AuthContext.tsx)) and local storage.
- The UI allows users to switch roles via [`components/ProfileSheet.tsx`](components/ProfileSheet.tsx), which updates storage/context and redirects them.
- Access to routes is protected by checking the user's role in [`components/RoleProtectedRoute.tsx`](components/RoleProtectedRoute.tsx).
- API requests include the current role and a role-specific token, handled in [`lib/api/client.ts`](lib/api/client.ts).
- There's also a separate, more granular permission system for team members in [`components/AddTeamMemberModal.tsx`](components/AddTeamMemberModal.tsx).

> Use this section as a reference for any future development or questions regarding role management in this project. 