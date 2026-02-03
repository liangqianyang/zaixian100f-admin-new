I will implement the system management modules based on the provided API documentation and user requirements.

1.  **Define API Modules**:
    - Update `src/api/user.ts`: Adapt `login` and `refreshToken` to match the backend structure (`/api/admin/login`, `/api/admin/refresh`).
    - Create `src/api/system.ts`: Define CRUD interfaces for `users`, `roles`, `menus`, and `permissions` based on the Swagger docs.

2.  **Implement Menu & Route Adaptation**:
    - Create a utility function `formatBackendMenuToRoute` in `src/router/utils.ts` to transform the backend menu structure (snake_case, flat fields) into Vue Router's `RouteRecordRaw` structure (nested `meta` fields).
    - Handle field mappings: `name` -> `meta.title`, `is_show` -> `meta.showLink`, `iframe_url` -> `meta.frameSrc`, etc.
    - Filter out button-type menus (`type === 3`) from the routing table.

3.  **Update Login & Routing Logic**:
    - Modify `src/store/modules/user.ts`: Update the `loginByUsername` action to handle the new response structure (storing `token`, `menus`, `permissions`).
    - Update `src/router/utils.ts`: Modify `initRouter` to use the menus returned from login (or `/api/admin/me`) instead of the old `getAsyncRoutes` mock.

4.  **Develop System Management Views**:
    - **Menu Management (`src/views/system/menu/index.vue`)**: Implement a Tree Table. The "Add/Edit" modal will match the user's screenshot but **exclude** the "External Link" (外链) tab as requested.
    - **Role Management (`src/views/system/role/index.vue`)**: Implement CRUD with a Permission Tree (using data from `/api/admin/permissions/all` or menu tree).
    - **User Management (`src/views/system/user/index.vue`)**: Implement CRUD with Role assignment.
    - **Permission Management (`src/views/system/permission/index.vue`)**: Implement CRUD for API/Button permissions.

5.  **Verification**:
    - Test the full flow: Login -> Dynamic Route Generation -> Access System Pages -> Perform CRUD operations.
