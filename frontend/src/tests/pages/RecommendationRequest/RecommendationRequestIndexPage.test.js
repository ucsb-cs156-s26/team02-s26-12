import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
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
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe("RecommendationRequestIndexPage tests", () => {
  const h = React.createElement;
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "RecommendationRequestTable";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const renderPage = () => {
    const queryClient = new QueryClient();
    render(
      h(
        QueryClientProvider,
        { client: queryClient },
        h(MemoryRouter, null, h(RecommendationRequestIndexPage)),
      ),
    );
  };

  test("renders with Create button for admin user", async () => {
    setupAdminUser();
    axiosMock.onGet("/api/RecommendationRequest/all").reply(200, []);

    renderPage();

    await screen.findByText("Create RecommendationRequest");
    const button = screen.getByText("Create RecommendationRequest");
    expect(button).toHaveAttribute("href", "/recommendationrequest/create");
    expect(button).toHaveAttribute("style", "float: right;");
    expect(button).toHaveClass("btn-primary");
    expect(screen.getByText("RecommendationRequests")).toBeInTheDocument();
    expect(
      screen.getByText("RecommendationRequests").closest(".pt-2"),
    ).toHaveClass("pt-2");
  });

  test("renders three recommendation requests correctly for regular user", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/RecommendationRequest/all")
      .reply(200, recommendationRequestFixtures.threeRecommendationRequests);

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3",
    );

    expect(
      screen.queryByText("Create RecommendationRequest"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent("student1@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-professorEmail`),
    ).toHaveTextContent("professor1@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
    ).toHaveTextContent("Request for a graduate school recommendation letter");
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).not.toBeInTheDocument();
  });

  test("renders empty table when backend unavailable, user only", async () => {
    setupUserOnly();
    axiosMock.onGet("/api/RecommendationRequest/all").timeout();

    const restoreConsole = mockConsole();

    renderPage();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1);
    });

    const errorMessage = console.error.mock.calls[0][0];
    expect(errorMessage).toMatch(
      "Error communicating with backend via GET on /api/RecommendationRequest/all",
    );
    restoreConsole();
  });

  test("admin can navigate to edit page", async () => {
    setupAdminUser();
    axiosMock
      .onGet("/api/RecommendationRequest/all")
      .reply(200, recommendationRequestFixtures.threeRecommendationRequests);

    renderPage();

    const editButton = await screen.findByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/recommendationrequest/edit/1");
  });

  test("admin can delete recommendation request", async () => {
    setupAdminUser();
    axiosMock
      .onGet("/api/RecommendationRequest/all")
      .reply(200, recommendationRequestFixtures.threeRecommendationRequests);
    axiosMock
      .onDelete("/api/RecommendationRequest")
      .reply(200, "RecommendationRequest with id 1 was deleted");

    renderPage();

    await waitFor(() => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-id`),
      ).toHaveTextContent("1");
    });

    const deleteButton = await screen.findByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        "RecommendationRequest with id 1 was deleted",
      );
    });
    await waitFor(() => {
      expect(axiosMock.history.delete.length).toBe(1);
    });
    expect(axiosMock.history.delete[0].url).toBe("/api/RecommendationRequest");
    expect(axiosMock.history.delete[0].params).toEqual({ id: 1 });

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(4);
    });
  });
});
