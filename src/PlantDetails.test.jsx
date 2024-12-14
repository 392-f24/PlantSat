import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PlantDetails from "./PlantDetails";

vi.mock("firebase/database", () => ({
    ref: vi.fn(),
    get: vi.fn().mockResolvedValue({
      exists: () => true,
      val: () => ({
        firstName: "John",
        lastName: "Doe",
        address: "New York City",
        email: "john.doe@example.com",
      }),
    }),
    getDatabase: vi.fn(), // Mock getDatabase
  }));

describe("PlantDetails Component", () => {
  const mockPlant = {
    name: "Fiddle Leaf Fig",
    imageUrl: "/fiddle-leaf.jpg",
    duration: 4,
    price: 100,
    care: "Water twice a week",
    owner: "user1",
    phoneNumber: "123-456-7890",
  };

  const mockHandleBooking = vi.fn();
  const mockOnClose = vi.fn();

  it("renders the loading state initially", () => {
    render(<PlantDetails plant={mockPlant} onClose={mockOnClose} handleBooking={mockHandleBooking} />);
    expect(screen.getByText("Loading..."));
  });

  it("renders plant details once data is loaded", async () => {
    render(<PlantDetails plant={mockPlant} onClose={mockOnClose} handleBooking={mockHandleBooking} />);
    expect(await screen.findByText(mockPlant.name));
    expect(screen.getByAltText(mockPlant.name));
    expect(screen.getByText(`Duration: ${mockPlant.duration} weeks`));
    expect(screen.getByText(`Total Compensation: $${mockPlant.price}`));
    expect(screen.getByText(`Care Details: ${mockPlant.care}`));
  });

  it("renders owner information correctly", async () => {
    render(<PlantDetails plant={mockPlant} onClose={mockOnClose} handleBooking={mockHandleBooking} />);
    expect(await screen.findByText("Name: John Doe"));
    expect(screen.getByText("City: New York City"));
    expect(screen.getByText("Email: john.doe@example.com"));
    expect(screen.getByText(`Phone: ${mockPlant.phoneNumber}`));
  });

  it("handles close button click", async () => {
    render(<PlantDetails plant={mockPlant} onClose={mockOnClose} handleBooking={mockHandleBooking} />);
    const closeButton = await screen.findByText("✕");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles Book Now button click", async () => {
    render(<PlantDetails plant={mockPlant} onClose={mockOnClose} handleBooking={mockHandleBooking} />);
    const bookNowButton = await screen.findByText("Book Now");
    fireEvent.click(bookNowButton);
    expect(mockHandleBooking).toHaveBeenCalledWith(mockPlant);
  });
});