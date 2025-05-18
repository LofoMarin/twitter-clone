import { render, screen, waitFor } from "@testing-library/react";
import Timeline from "../src/components/timeline/Timeline";
import { useAuth } from "@/contexts/AuthContext";

// Mocks
jest.mock("@/contexts/AuthContext");

describe("Timeline", () => {
  const mockUser = {
    uid: "user123",
    name: "name",
    displayName: "display name",
    username: "username123"
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockUser
    });
  });

  test("displays welcome message on registration", async () => {
    localStorage.setItem("registrationSuccess", "true");

    render(<Timeline />);

    await waitFor(() => {
      expect(
        screen.getByText(/¡Bienvenido a Not Twitter, name/i)
      ).toBeInTheDocument();
    });

    expect(localStorage.getItem("registrationSuccess")).toBeNull();
  });

  test("displays welcome message on login", async () => {
    localStorage.setItem("loginSuccess", "true");

    render(<Timeline />);

    await waitFor(() => {
      expect(
        screen.getByText(/¡Bienvenido de nuevo, name/i)
      ).toBeInTheDocument();
    });

    expect(localStorage.getItem("loginSuccess")).toBeNull();
  });
});
