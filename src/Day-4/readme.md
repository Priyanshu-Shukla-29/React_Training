Product Management System (CRUD & Search)

A React-based administration dashboard built with Material UI (v4) that provides a full interface for managing product data. It features real-time search highlighting, server-side data synchronization (GET, PUT, DELETE), and paginated data display.

------------------------------------------------------------------------------------------------------------
Features

1. Dynamic Data Table
Server-Side Fetch: Retrieves product data from an external Express API on mount using asynchronous state management.

Pagination: Navigates through records with configurable rows per page (5, 10, or 25) to optimize performance for large datasets.

Responsive Layout: Built using Material UI Table and Paper components for a clean, professional user interface.

2. Advanced Search & Highlighting
Filtered Results: Search by Product Name or Description.

Visual Cues: Automatically highlights matching text using a <mark> tag with a yellow background, making it easy to identify why a product was returned in the search.

3. Full CRUD Operations
Create (New): Add new inventory items via a dedicated "Add New Product" modal.

Read: Real-time data synchronization with the backend PostgreSQL database.

Update (Edit): A managed Dialog (Modal) allows users to modify product names and descriptions without leaving the page.

Delete: Remove products directly from the list with instant state updates.

Persistence: All changes are synced to the backend via POST, PUT, and DELETE requests.

------------------------------------------------------------------------------------------------------------