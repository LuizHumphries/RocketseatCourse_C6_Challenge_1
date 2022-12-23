import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { SignInButton } from ".";

jest.mock("next-auth/react");

describe("SignInButton component", () => {
  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValue({ data: null, status: "loading" });
    render(<SignInButton />);
    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });
});
describe("SignInButton component", () => {
  it("renders correctly when user is authenticated", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValue({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
      },
    } as any);
    render(<SignInButton />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
