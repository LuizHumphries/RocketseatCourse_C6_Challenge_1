import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PostPreview from "../../pages/posts/preview/[slug]";
import Post from "../../pages/posts/preview/[slug]";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

const post = {
  slug: "my-new-post",
  title: "My new post",
  content: "<p>Post content</p>",
  updatedAt: "04-01-2021",
};

describe("PostPreview Page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated",
    });

    render(<Post post={post} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full page when authenticated", async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires",
      },
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });
});
