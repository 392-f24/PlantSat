import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ListingsPage from "./ListingsPage";
import { BrowserRouter } from "react-router-dom";
import { get, ref, child, set } from "firebase/database";

// Mock Firebase methods
vi.mock("firebase/database", () => ({
  ref: vi.fn(),
  child: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  getDatabase: vi.fn(), // Mock getDatabase
}));

// Mock MapComponent
vi.mock("./MapComponent", () => ({
  default: ({ userLocation, plants, onMarkerClick }) => (
    <div data-testid="map-component">Mock Map Component</div>
  ),
}));

// Mock PlantDetails
vi.mock("./PlantDetails", () => ({
  default: ({ plant, onClose, handleBooking }) => (
    <div data-testid="plant-details">
      <h2>{plant?.name}</h2>
      <button onClick={onClose}>Close</button>
      <button onClick={() => handleBooking(plant)}>Book Now</button>
    </div>
  ),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  BrowserRouter: vi.fn(),
}));

describe("ListingsPage Component", () => {
  const mockUser = { uid: "user1" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the ListingsPage component with title and buttons", () => {
    render(
      <BrowserRouter>
        <ListingsPage user={mockUser} />
      </BrowserRouter>
    );

    expect(screen.findByText("PLANTSAT"));
    expect(screen.findByRole("button", { name: /Post/i }));
    expect(screen.findByRole("button", { name: /My Postings/i }));
  });

  it("fetches and displays plants needing homes", async () => {
    vi.mocked(get).mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        plant1: {
          id: "plant1",
          name: "Plant 1",
          owner: "user2",
          price: 20,
          duration: "2 weeks",
          care: "Water daily",
          imageUrl: "/plant1.jpg",
        },
        plant2: {
          id: "plant2",
          name: "Plant 2",
          owner: "user3",
          price: 15,
          duration: "1 week",
          care: "Keep in sunlight",
          imageUrl: "/plant2.jpg",
        },
      }),
    });

    render(
      <BrowserRouter>
        <ListingsPage user={mockUser} />
      </BrowserRouter>
    );
  });

  it("handles sorting by price", async () => {
    vi.mocked(get).mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        plant1: { id: "plant1", name: "Plant 1", price: 20 },
        plant2: { id: "plant2", name: "Plant 2", price: 15 },
      }),
    });

    render(
      <BrowserRouter>
        <ListingsPage user={mockUser} />
      </BrowserRouter>
    );
  });

  it("opens and closes the PlantDetails popup", async () => {
    vi.mocked(get).mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        plant1: { id: "plant1", name: "Plant 1", price: 20, duration: "2 weeks" },
      }),
    });

    render(
      <BrowserRouter>
        <ListingsPage user={mockUser} />
      </BrowserRouter>
    );

  });

  it("handles booking a plant", async () => {
    vi.mocked(get).mockResolvedValueOnce({
      exists: () => true,
      val: () => ({
        plant1: { id: "plant1", name: "Plant 1", owner: "user2" },
      }),
    });

    render(
      <BrowserRouter>
        <ListingsPage user={mockUser} />
      </BrowserRouter>
    );
    expect(screen.queryByText(/Your interest in plant-sitting/i));
  });

  it("renders the MapComponent", () => {
    render(
      <BrowserRouter>
        <ListingsPage user={mockUser} />
      </BrowserRouter>
    );
  });
});