import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

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

describe("RecommendationRequestCreatePage tests", () => {
  const h = React.createElement;
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

  const renderPage = () => {
    const queryClient = new QueryClient();
    render(
      h(
        QueryClientProvider,
        { client: queryClient },
        h(MemoryRouter, null, h(RecommendationRequestCreatePage)),
      ),
    );
  };

  const fillValidForm = () => {
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      {
        target: { value: "student1@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-professorEmail"),
      {
        target: { value: "professor1@ucsb.edu" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-explanation"),
      {
        target: {
          value: "Request for a graduate school recommendation letter",
        },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateRequested"),
      {
        target: { value: "2026-04-20T10:15" },
      },
    );
    fireEvent.change(
      screen.getByTestId("RecommendationRequestForm-dateNeeded"),
      {
        target: { value: "2026-05-01T17:00" },
      },
    );
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-done"));
  };

  test("page renders", async () => {
    renderPage();

    await screen.findByText("Create New RecommendationRequest");
    expect(
      screen.getByText("Create New RecommendationRequest").closest(".pt-2"),
    ).toHaveClass("pt-2");
    expect(
      screen.getByTestId("RecommendationRequestForm-requesterEmail"),
    ).toBeInTheDocument();
  });

  test("form submit calls POST with correct data", async () => {
    const recommendationRequest = {
      id: 7,
      requesterEmail: "student1@ucsb.edu",
      professorEmail: "professor1@ucsb.edu",
      explanation: "Request for a graduate school recommendation letter",
      dateRequested: "2026-04-20T10:15",
      dateNeeded: "2026-05-01T17:00",
      done: true,
    };

    axiosMock
      .onPost("/api/RecommendationRequest/post")
      .reply(202, recommendationRequest);

    renderPage();

    await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    fillValidForm();
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "student1@ucsb.edu",
      professorEmail: "professor1@ucsb.edu",
      explanation: "Request for a graduate school recommendation letter",
      dateRequested: "2026-04-20T10:15",
      dateNeeded: "2026-05-01T17:00",
      done: true,
    });
  });

  test("success message is shown and user is redirected to recommendationrequest", async () => {
    const recommendationRequest = {
      id: 7,
      requesterEmail: "student1@ucsb.edu",
      professorEmail: "professor1@ucsb.edu",
      explanation: "Request for a graduate school recommendation letter",
      dateRequested: "2026-04-20T10:15",
      dateNeeded: "2026-05-01T17:00",
      done: true,
    };

    axiosMock
      .onPost("/api/RecommendationRequest/post")
      .reply(202, recommendationRequest);

    renderPage();

    await screen.findByTestId("RecommendationRequestForm-requesterEmail");
    fillValidForm();
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    await waitFor(() =>
      expect(mockToast).toBeCalledWith(
        "New RecommendationRequest Created - id: 7 requesterEmail: student1@ucsb.edu",
      ),
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });

  test("invalid form data is not submitted", async () => {
    renderPage();

    await screen.findByTestId("RecommendationRequestForm-submit");
    fireEvent.click(screen.getByTestId("RecommendationRequestForm-submit"));

    expect(
      await screen.findByText("Requester Email is required."),
    ).toBeInTheDocument();
    expect(axiosMock.history.post.length).toBe(0);
    expect(mockToast).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
