import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
const mockNavigateBack = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      id: 17,
    })),
    useNavigate: () => mockNavigateBack,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("MenuItemReviewEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/MenuItemReview", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      mockNavigateBack.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item Review");
      expect(
        screen.queryByTestId("MenuItemReviewForm-itemId"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/MenuItemReview", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemId: 101,
          reviewerEmail: "cgaucho@ucsb.edu",
          stars: 5,
          dateReviewed: "2022-01-02T12:00:00",
          comments: "Best pizza at Carrillo",
        });
      axiosMock.onPut("/api/MenuItemReview").reply(200, {
        id: 17,
        itemId: 102,
        reviewerEmail: "cgaucho@ucsb.edu",
        stars: 4,
        dateReviewed: "2022-01-03T10:00:00",
        comments: "Updated notes",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      mockNavigateBack.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const emailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toHaveValue("17");
      expect(itemIdField).toHaveValue("101");
      expect(emailField).toHaveValue("cgaucho@ucsb.edu");
      expect(starsField).toHaveValue(5);
      expect(commentsField).toHaveValue("Best pizza at Carrillo");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemIdField, { target: { value: "102" } });
      fireEvent.change(starsField, { target: { value: "4" } });
      fireEvent.change(dateField, { target: { value: "2022-01-03T10:00" } });
      fireEvent.change(commentsField, { target: { value: "Updated notes" } });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - id: 17 itemId: 102",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "102",
          reviewerEmail: "cgaucho@ucsb.edu",
          stars: "4",
          dateReviewed: "2022-01-03T10:00",
          comments: "Updated notes",
        }),
      );
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      fireEvent.change(itemIdField, { target: { value: "102" } });
      fireEvent.change(screen.getByTestId("MenuItemReviewForm-stars"), {
        target: { value: "4" },
      });
      fireEvent.change(screen.getByTestId("MenuItemReviewForm-dateReviewed"), {
        target: { value: "2022-01-03T10:00" },
      });
      fireEvent.change(screen.getByTestId("MenuItemReviewForm-comments"), {
        target: { value: "Updated notes" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - id: 17 itemId: 102",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
    });

    test("does not PUT when form data is invalid", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-comments");

      fireEvent.change(screen.getByTestId("MenuItemReviewForm-comments"), {
        target: { value: "" },
      });
      fireEvent.click(screen.getByTestId("MenuItemReviewForm-submit"));

      expect(
        await screen.findByText(/Comments are required./),
      ).toBeInTheDocument();
      expect(axiosMock.history.put.length).toBe(0);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("Cancel navigates back like the browser back button", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-cancel");

      fireEvent.click(screen.getByTestId("MenuItemReviewForm-cancel"));

      expect(mockNavigateBack).toHaveBeenCalledWith(-1);
      expect(axiosMock.history.put.length).toBe(0);
    });
  });
});
