import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-itemId"),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("Create MenuItemReview")).toBeInTheDocument();
  });

  test("on submit with valid data, posts to backend and navigates to index", async () => {
    const saved = {
      id: 42,
      itemId: 123,
      reviewerEmail: "arjun@ucsb.edu",
      stars: 4,
      dateReviewed: "2026-04-30T15:00:00",
      comments: "Great selection!",
    };

    axiosMock.onPost("/api/MenuItemReview/post").reply(202, saved);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-itemId"),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("MenuItemReviewForm-itemId"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByTestId("MenuItemReviewForm-reviewerEmail"), {
      target: { value: "arjun@ucsb.edu" },
    });
    fireEvent.change(screen.getByTestId("MenuItemReviewForm-stars"), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByTestId("MenuItemReviewForm-dateReviewed"), {
      target: { value: "2026-04-30T15:00" },
    });
    fireEvent.change(screen.getByTestId("MenuItemReviewForm-comments"), {
      target: { value: "Great selection!" },
    });

    fireEvent.click(screen.getByTestId("MenuItemReviewForm-submit"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "123",
      reviewerEmail: "arjun@ucsb.edu",
      stars: "4",
      dateReviewed: "2026-04-30T15:00",
      comments: "Great selection!",
    });

    expect(mockToast).toHaveBeenCalledWith(
      "New MenuItemReview Created - id: 42 itemId: 123",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreview" });
  });

  test("on submit with invalid data, does not POST and stays on page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("MenuItemReviewForm-submit"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("MenuItemReviewForm-submit"));

    expect(await screen.findByText(/Item Id is required./)).toBeInTheDocument();
    expect(axiosMock.history.post.length).toBe(0);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
