import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tweet from "../src/components/tweets/Tweet";
import { useAuth } from "@/contexts/AuthContext";
import { toggleLike } from "@/services/tweetService";

jest.mock("@/contexts/AuthContext");
jest.mock("@/services/tweetService");

const mockCurrentUser = { uid: "123" };
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
  const mockOnTweetDeleted = jest.fn();
  const mockOnTweetUpdated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser
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

  test("shows liked state when user has liked the tweet", () => {
    // Tweet with like from current user
    const likedTweet = {
      ...testTweet,
      likes: ["123", "456"]
    };

    render(
      <Tweet 
        tweet={likedTweet} 
        onTweetDeleted={mockOnTweetDeleted} 
        onTweetUpdated={mockOnTweetUpdated} 
      />
    );

    // Check if like button shows liked state
    expect(screen.getByTestId('like-button')).toHaveClass('liked');

    // Check like count
    expect(screen.getByText("2")).toBeInTheDocument();

    // Check if liked-svg is rendered
    expect(screen.getByTestId('liked-svg')).toBeInTheDocument();
  });

  test("shows unliked state when user has not liked the tweet", () => {
    // Tweet without like from current user
    const unlikedTweet = {
      ...testTweet,
      likes: ["456"] // Current user has not liked this tweet
    };

    render(
      <Tweet 
        tweet={unlikedTweet} 
        onTweetDeleted={mockOnTweetDeleted} 
        onTweetUpdated={mockOnTweetUpdated} 
      />
    );

    expect(screen.getByTestId('like-button')).not.toHaveClass('liked');
    
    // Check like count
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("handles like toggle successfully", async () => {
    const user = userEvent.setup();
    (toggleLike as jest.Mock).mockResolvedValue({});

    render(
      <Tweet 
        tweet={testTweet} 
        onTweetDeleted={mockOnTweetDeleted} 
        onTweetUpdated={mockOnTweetUpdated} 
      />
    );

    // Click like button
    await user.click(screen.getByTestId('like-button')!);

    // Verify toggleLike was called with correct parameters
    expect(toggleLike).toHaveBeenCalledWith("1", "123");
    expect(mockOnTweetUpdated).toHaveBeenCalled();
  });

  test("does not show delete button for non-owner", () => {
    const otherUserTweet = {
      ...testTweet,
      userId: "456" // Different user owns this tweet
    };

    render(
      <Tweet 
        tweet={otherUserTweet} 
        onTweetDeleted={mockOnTweetDeleted} 
        onTweetUpdated={mockOnTweetUpdated} 
      />
    );
    
    // Delete button should not be present
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });

  test("shows delete button for owner", () => {
    render(
      <Tweet 
        tweet={testTweet} 
        onTweetDeleted={mockOnTweetDeleted} 
        onTweetUpdated={mockOnTweetUpdated} 
      />
    );
    
    // Delete button should be present
    expect(screen.queryByTestId('delete-button')).toBeInTheDocument();
  });

});
