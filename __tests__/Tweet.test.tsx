import { render, screen } from "@testing-library/react";
import Tweet from "../src/components/tweets/Tweet";
import { useAuth } from "@/contexts/AuthContext";

jest.mock("@/contexts/AuthContext");

const testTweet = {
  id: "1",
  userId: "123",
  username: "testuser",
  name: "Test User",
  createdAt: "2023-05-12T17:09:58Z",
  content: "This is a test tweet",
  likes: ["123"],
  comments: [],
};

describe("Tweet", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { uid: "123" },
    });
  });

  test("renders tweet with correct information", () => {
    render(<Tweet tweet={testTweet} onTweetDeleted={() => {}} onTweetUpdated={() => {}} />);

    // Check if tweet content is rendered
    expect(screen.getByText("This is a test tweet")).toBeInTheDocument();

    // Check if tweet username is rendered
    expect(screen.getByText("@testuser")).toBeInTheDocument();

    // Check if tweet name is rendered
    expect(screen.getByText("Test User")).toBeInTheDocument();

    // Check if tweet date is rendered
    expect(screen.getByText("5/12/2023 12:09:58 PM")).toBeInTheDocument();

    // Check if like count is rendered
    expect(screen.getByText("1")).toBeInTheDocument();

    // Check if comment count is rendered
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
