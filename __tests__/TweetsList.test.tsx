import { render, screen, waitFor } from "@testing-library/react";
import TweetsList from "../src/components/tweets/TweetsList";
import { useAuth } from "@/contexts/AuthContext";
import { getUserTweets, getAllTweets } from "@/services/tweetService";

jest.mock("@/contexts/AuthContext");
jest.mock("@/services/tweetService");

const testTweets = [
  {
    id: "1",
    userId: "123",
    username: "testuser",
    name: "Test User",
    createdAt: "2023-05-12T17:09:58Z",
    content: "This is a test tweet",
    likes: ["123"],
    comments: [
      {
        id: "c1",
        userId: "456",
        username: "commenter",
        createdAt: "2023-05-12T18:09:58Z",
        content: "This is a test comment",
      },
    ],
  },
];

describe("TweetsList", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: "123" },
    });

    (getUserTweets as jest.Mock).mockResolvedValue(testTweets);
    (getAllTweets as jest.Mock).mockResolvedValue(testTweets);
  });

  test("renders tweets with correct information", async () => {
    render(<TweetsList userId="123" onRefresh={() => {}} showGlobalFeed={false} />);

    // Check if loading state is rendered
    expect(screen.getByText("Cargando tweets...")).toBeInTheDocument();

    // Wait for tweets to be loaded
    await waitFor(() => expect(screen.getByText("This is a test tweet")).toBeInTheDocument());

    // Check if tweet content is rendered
    expect(screen.getByText("This is a test tweet")).toBeInTheDocument();

    // Check if tweet username is rendered
    expect(screen.getByText("@testuser")).toBeInTheDocument();

    // Check if tweet name is rendered
    expect(screen.getByText("Test User")).toBeInTheDocument();

    // Check if tweet date is rendered
    expect(screen.getByText("5/12/2023 12:09:58 PM")).toBeInTheDocument();

    // Check if like count is rendered
    const likeCounts = screen.getAllByText("1");
    expect(likeCounts).toHaveLength(2); // One for likes and one for comments
  });

  test("renders empty state when no tweets are available", async () => {
    (getUserTweets as jest.Mock).mockResolvedValue([]);
    (getAllTweets as jest.Mock).mockResolvedValue([]);

    render(<TweetsList userId="123" onRefresh={() => {}} showGlobalFeed={false} />);

    // Wait for tweets to be loaded
    await waitFor(() => expect(screen.getByText("No hay tweets para mostrar")).toBeInTheDocument());

    // Check if empty state is rendered
    expect(screen.getByText("No hay tweets para mostrar")).toBeInTheDocument();
    expect(screen.getByText("¡Sé el primero en publicar algo!")).toBeInTheDocument();
  });

  test("renders error message when there is an error loading tweets", async () => {
    (getUserTweets as jest.Mock).mockRejectedValue(new Error("Failed to load tweets"));
    (getAllTweets as jest.Mock).mockRejectedValue(new Error("Failed to load tweets"));

    render(<TweetsList userId="123" onRefresh={() => {}} showGlobalFeed={false} />);

    // Wait for error message to be displayed
    await waitFor(() => expect(screen.getByText("Error al cargar los tweets: Failed to load tweets")).toBeInTheDocument());

    // Check if error message is rendered
    expect(screen.getByText("Error al cargar los tweets: Failed to load tweets")).toBeInTheDocument();
  });
});
