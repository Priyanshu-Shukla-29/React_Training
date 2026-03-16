Product Management Dashboard
A React-based data table component built with Material UI v4 that features server-side data fetching, client-side pagination, and advanced search functionality with real-time text highlighting.

------------------------------------------------------------------------------------------------------------

Features

Dynamic Data Fetching: Fetches product details from an Express API on component mount.

Search & Filter: Allows users to filter products by Name or Description.

Text Highlighting: Matches found during a search are automatically wrapped in a <mark> tag for visual emphasis.

MUI Pagination: Seamless navigation through large datasets with configurable rows per page (5, 10, or 25).

TypeScript Optimized: Fully typed props and states using custom interfaces.

------------------------------------------------------------------------------------------------------------

Component Logic Explained
 
getHighlightedText :-Uses a Regular Expression to split text by the search query and maps matches to a yellow <mark> tag.

handleFilter :- Synchronizes the filteredData state with the original data based on the user's input.

TablePagination :- Manages the slicing of the array: data.slice(page * row, page * row + row).

