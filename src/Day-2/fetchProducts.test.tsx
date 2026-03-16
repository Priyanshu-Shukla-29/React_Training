import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import FetchProducts from "./FetchProducts";

// 1. Mock data wrapped in a "payload" object to match your component's logic
const mockApiResponse = {
  payload: [
    {
      productId: 101,
      productName: "Sample Product",
      productDescription: "High Quality",
    },
  ],
};

describe("FetchProducts Component", () => {
  beforeEach(() => {
    // 2. Define fetch on window to avoid "undefined" errors in JSDOM
    (window as any).fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete (window as any).fetch;
  });

  test("should display product data from the payload in the table", async () => {
    render(<FetchProducts />);

    // Verify static title
    expect(screen.getByText(/Product Data/i)).toBeInTheDocument();

    // 3. Use waitFor to wait for the async fetchALL() to update state
    await waitFor(() => {
      // Check for the name
      expect(screen.getByText("Sample Product")).toBeInTheDocument();
      // Check for the description (role column)
      expect(screen.getByText("High Quality")).toBeInTheDocument();
    });
  });
});
