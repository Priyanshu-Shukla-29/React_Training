import React from 'react'; 
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteAndEdit from "./DeleteAndEdit";

const mockInitialData = {
  payload: [
    {
      productId: "101",
      productName: "Original Phone",
      productDescription: "Standard Smartphone",
    },
    {
      productId: "102",
      productName: "Old Laptop",
      productDescription: "Legacy device",
    },
  ],
};

describe("DeleteAndEdit Component", () => {
  beforeEach(() => {
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      value: jest.fn().mockImplementation((url, options) => {
        if (options && (options.method === "DELETE" || options.method === "PUT")) {
          return Promise.resolve({
            status: 200,
            ok: true,
            json: () => Promise.resolve({
              payload: [
                {
                  productId: "101",
                  productName: "Updated Name",
                  productDescription: "Standard Smartphone",
                },
              ],
            }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockInitialData),
        });
      }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should display data and handle search highlighting", async () => {
    render(<DeleteAndEdit />);
    await waitFor(() => expect(screen.getByText("Original Phone")).toBeInTheDocument());

    const searchInput = screen.getByLabelText(/Controlled/i);
    const searchBtn = screen.getByRole("button", { name: /search/i });

    fireEvent.change(searchInput, { target: { value: "Phone" } });
    fireEvent.click(searchBtn);

    const highlight = screen.getByText("Phone");
    expect(highlight.tagName).toBe("MARK");
  });

  test("should handle product deletion", async () => {
    render(<DeleteAndEdit />);
    await waitFor(() => expect(screen.getByText("Old Laptop")).toBeInTheDocument());

    const deleteButtons = screen.getAllByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(screen.queryByText("Old Laptop")).not.toBeInTheDocument();
    });
  });

  test("should open edit modal, change values, and save", async () => {
    render(<DeleteAndEdit />);
    await waitFor(() => expect(screen.getByText("Original Phone")).toBeInTheDocument());

    // 1. Click the Edit button for the first item
    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    fireEvent.click(editButtons[0]);

    // 2. Wait for the Modal to appear
    await waitFor(() => expect(screen.getByText("Edit Product")).toBeInTheDocument());

    // 3. Find input by Placeholder or Display value if Label matching fails
    // Using display value is often more reliable for MUI Dialogs in tests
    const nameInput = screen.getByDisplayValue("Original Phone");
    
    fireEvent.change(nameInput, { target: { name: "productName", value: "Updated Name" } });

    // 4. Find and click Save
    const saveBtn = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveBtn);

    // 5. Verify the table updates with the new name
    await waitFor(() => {
      expect(screen.getByText("Updated Name")).toBeInTheDocument();
      expect(screen.queryByText("Edit Product")).not.toBeInTheDocument();
    });
  });
});