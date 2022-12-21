import { render, screen } from "@testing-library/react";
import Home, { getStaticProps } from "../../pages";

import { stripe } from "../../services/stripe";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react");
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("../../services/stripe");

describe("Home Page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "authenticated",
    });
    render(<Home product={{ priceId: "fake-priceId", amount: "R$ 10,00" }} />);
    expect(screen.getByText("for R$ 10,00 month")).toBeInTheDocument();
  });

  it("load inicial data", async () => {
    const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve);
    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-pricesId",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-pricesId",
            amount: "$10.00",
          },
        },
        revalidate: 86400,
      })
    );
  });
});
