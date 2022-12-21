import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated",
    });
    render(<SubscribeButton />);
    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated",
    });
    const signInMocked = jest.mocked(signIn);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects user to full page when authenticated", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: "fake-active-subscription" },
      false,
    ] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });
