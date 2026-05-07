import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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
const mockFormNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
    useNavigate: () => mockFormNavigate,
  };
});

describe("RecommendationRequestEditPage tests", () => {
  const h = React.createElement;
  const axiosMock = new AxiosMockAdapter(axios);

  const recommendationRequest = {
    id: 17,
    requesterEmail: "student17@ucsb.edu",
    professorEmail: "professor17@ucsb.edu",
    explanation: "Request for a graduate school recommendation letter",
    dateRequested: "2026-04-20T10:15",
    dateNeeded: "2026-05-01T17:00",
    done: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const renderPage = () => {
    const queryClient = new QueryClient();
    render(
      h(
        QueryClientProvider,
        { client: queryClient },
        h(MemoryRouter, null, h(RecommendationRequestEditPage)),
      ),
    );
  };

  test("renders header but form is not present when backend unavailable", async () => {
    axiosMock
      .onGet("/api/RecommendationRequest", { params: { id: 17 } })
      .timeout();
    const restoreConsole = mockConsole();

    renderPage();

    await screen.findByText("Edit RecommendationRequest");
    expect(
      screen.queryByTestId("RecommendationRequestForm-requesterEmail"),
    ).not.toBeInTheDocument();
    restoreConsole();
  });

  test("loads existing record by id and populates form", async () => {
    axiosMock
      .onGet("/api/RecommendationRequest", { params: { id: 17 } })
      .reply(200, recommendationRequest);

    renderPage();

    await screen.findByTestId("RecommendationRequestForm-id");

    expect(screen.getByText("Edit RecommendationRequest")).toBeInTheDocument();
    expect(
      screen.getByText("Edit RecommendationRequest").closest(".pt-2"),
    ).toHaveClass("pt-2");
    expect(screen.getByTestId("RecommendationRequestForm-id")).toHaveValue(
      "17",
    );
    expect(screen.getByTestId("RecommendationRequestForm-id")).toHaveAttribute(
      "readOnly",
    );
    expect(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
    ).toHaveValue("student17@ucsb.edu");
    expect(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
    ).toHaveValue("professor17@ucsb.edu");
    expect(
      screen.getByTestId("RecommendationRequestForm-explanation"),
    ).toHaveValue("Request for a graduate school recommendation letter");
    expect(
      screen.getByTestId("RecommendationRequestForm-dateRequested"),
    ).toHaveValue("2026-04-20T10:15");
    expect(
      screen.getByTestId("RecommendationRequestForm-dateNeeded"),
    ).toHaveValue("2026-05-01T17:00");
    expect(
      screen.getByTestId("RecommendationRequestForm-done"),
    ).not.toBeChecked();
    expect(
      screen.getByTestId("RecommendationRequestForm-submit"),
    ).toHaveTextContent("Update");

    expect(axiosMock.history.get[2].url).toBe("/api/RecommendationRequest");
    expect(axiosMock.history.get[2].params).toEqual({ id: 17 });
  });

  test("submit valid changes with PUT and redirects", async () => {
    axiosMock
      .onGet("/api/RecommendationRequest", { params: { id: 17 } })
      .reply(200, recommendationRequest);
    axiosMock.onPut("/api/RecommendationRequest").reply(200, {
      id: 17,
      requesterEmail: "updated-student@ucsb.edu",
      professorEmail: "updated-professor@ucsb.edu",
      explanation: "Updated request for a fellowship application",
      dateRequested: "2026-04-21T11:30",
      dateNeeded: "2026-05-03T16:45",
      done: true,
    });

    renderPage();

    await screen.findByTestId("RecommendationRequestForm-id");

    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      {
        target: { value: "updated-student@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
      {
        target: { value: "updated-professor@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-explanation"),
      {
        target: { value: "Updated request for a fellowship application" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateRequested"),
      {
        target: { value: "2026-04-21T11:30" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateNeeded"),
      {
        target: { value: "2026-05-03T16:45" },
      },
    );
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-done"));
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    await waitFor(() => expect(axiosMock.history.put.length).toBe(1));
    expect(axiosMock.history.put[0].url).toBe("/api/RecommendationRequest");
    expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
    expect(axiosMock.history.put[0].data).toBe(
      JSON.stringify({
        requesterEmail: "updated-student@ucsb.edu",
        professorEmail: "updated-professor@ucsb.edu",
        explanation: "Updated request for a fellowship application",
        dateRequested: "2026-04-21T11:30",
        dateNeeded: "2026-05-03T16:45",
        done: true,
      }),
    );

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        "RecommendationRequest Updated - id: 17 requesterEmail: updated-student@ucsb.edu",
      ),
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/recommendationrequest" });
  });

  test("cancel button navigates back like browser back button", async () => {
    axiosMock
      .onGet("/api/RecommendationRequest", { params: { id: 17 } })
      .reply(200, recommendationRequest);

    renderPage();

    await screen.findByTestId("RecommendationRequestForm-cancel");
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-cancel"));

    expect(mockFormNavigate).toHaveBeenCalledWith(-1);
  });

  test("invalid data shows validation errors and does not submit", async () => {
    axiosMock
      .onGet("/api/RecommendationRequest", { params: { id: 17 } })
      .reply(200, recommendationRequest);

    renderPage();

    await screen.findByTestId("RecommendationRequestForm-id");

    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      {
        target: { value: "" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
      {
        target: { value: "" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-explanation"),
      {
        target: { value: "" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateRequested"),
      {
        target: { value: "" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateNeeded"),
      {
        target: { value: "" },
      },
    );
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    expect(
      await screen.findByText("Requester Email is required."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Professor Email is required."),
    ).toBeInTheDocument();
    expect(screen.getByText("Explanation is required.")).toBeInTheDocument();
    expect(screen.getByText("Date Requested is required.")).toBeInTheDocument();
    expect(screen.getByText("Date Needed is required.")).toBeInTheDocument();
    expect(axiosMock.history.put.length).toBe(0);
    expect(mockToast).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
