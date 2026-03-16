Product Data Fetcher Component

A React functional component built with TypeScript and Material-UI (MUI). This component fetches product information from a local Express server and renders it in a clean, responsive table.

------------------------------------------------------------------------------------------------------------

Features
- Asynchronous Fetching: Uses async/await within a useEffect hook for clean data loading.

- State Management: Utilizes useState to store and update the product list.

- Material-UI Integration: Leverages TableContainer, Paper, and Typography for a modern UI.

- Type Safety: Integrated with ProductType to ensure data integrity.

------------------------------------------------------------------------------------------------------------

Code Explanation
1. useState<ProductType[]> :- Initializes an empty array to hold your product data.
2. fetchALL() :- An internal async function that calls the API and extracts the .payload.
3. useEffect :- Acts as a lifecycle method to trigger the API call once when the component mounts.
4. .map() :- Iterates through the data state to dynamically generate table rows.

------------------------------------------------------------------------------------------------------------

FETCH VS AXIOS
While Fetch is great for simple apps because it requires no extra dependencies, Axios is often preferred for production apps.

