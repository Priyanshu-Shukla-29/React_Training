
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaginatedTable from "./PaginatedTable";

// 1. Mock data with multiple items to test pagination and filtering
const mockApiResponse = {
  payload: [
    {
      productId: "101",
      productName: "Apple iPhone",
      productDescription: "Latest model smartphone",
    },
    {
      productId: "102",
      productName: "Samsung Galaxy",
      productDescription: "Android flagship device",
    },
  ],
};

describe("PaginatedTable Component", () => {
  beforeEach(() => {
    // 2. Mock window.fetch
    (window as any).fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (window as any).fetch;
  });

  test("should display initial product data and handle search highlighting", async () => {
    render(<PaginatedTable />);

    // Verify loading state / static content
    expect(screen.getByText(/Product Data/i)).toBeInTheDocument();

    // 3. Wait for the data to fetch and render
    await waitFor(() => {
      expect(screen.getByText("Apple iPhone")).toBeInTheDocument();
      expect(screen.getByText("Latest model smartphone")).toBeInTheDocument();
    });

    // 4. Test Search Functionality
    const searchInput = screen.getByLabelText(/Controlled/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    // Type "Apple" into the search box
    fireEvent.change(searchInput, { target: { value: "Apple" } });
    // Click the search button
    fireEvent.click(searchButton);

    // 5. Verify Filtering & Highlighting
    // "Apple" should now be inside a <mark> tag
    const highlightedText = screen.getByText("Apple");
    expect(highlightedText.tagName).toBe("MARK");
    expect(highlightedText).toHaveStyle("background-color: yellow");

    // The Samsung product should no longer be visible
    expect(screen.queryByText("Samsung Galaxy")).not.toBeInTheDocument();
  });

  test("should reset view when search is cleared and searched again", async () => {
    render(<PaginatedTable />);

    await waitFor(() => screen.getByText("Apple iPhone"));

    const searchInput = screen.getByLabelText(/Controlled/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    // Filter to nothing
    fireEvent.change(searchInput, { target: { value: "NonExistent" } });
    fireEvent.click(searchButton);
    expect(screen.queryByText("Apple iPhone")).not.toBeInTheDocument();

    // Clear and click search
    fireEvent.change(searchInput, { target: { value: "" } });
    fireEvent.click(searchButton);

    // Items should return
    expect(screen.getByText("Apple iPhone")).toBeInTheDocument();
    expect(screen.getByText("Samsung Galaxy")).toBeInTheDocument();
  });
});