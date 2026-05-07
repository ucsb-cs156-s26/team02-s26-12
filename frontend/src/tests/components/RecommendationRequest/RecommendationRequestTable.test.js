import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe("RecommendationRequestTable tests", () => {
  const h = React.createElement;
  const testId = "RecommendationRequestTable";

  const expectedHeaders = [
    "id",
    "Requester Email",
    "Professor Email",
    "Explanation",
    "Date Requested",
    "Date Needed",
    "Done",
  ];

  const expectedFields = [
    "id",
    "requesterEmail",
    "professorEmail",
    "explanation",
    "dateRequested",
    "dateNeeded",
    "done",
  ];

  const renderTable = (props) => {
    const queryClient = new QueryClient();
    render(
      h(
        QueryClientProvider,
        { client: queryClient },
        h(
          MemoryRouter,
          null,
          h(RecommendationRequestTable, {
            recommendationRequests: [],
            ...props,
          }),
        ),
      ),
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders empty table correctly", () => {
    renderTable({ recommendationRequests: [] });

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.queryByTestId(`${testId}-cell-row-0-col-${field}`),
      ).not.toBeInTheDocument();
    });
  });

  test("has the expected column headers and content", () => {
    renderTable({
      recommendationRequests:
        recommendationRequestFixtures.threeRecommendationRequests,
    });

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.getByTestId(`${testId}-cell-row-0-col-${field}`),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1",
    );
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
      screen.getByTestId(`${testId}-cell-row-0-col-dateRequested`),
    ).toHaveTextContent("2026-04-20T10:15:30");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateNeeded`),
    ).toHaveTextContent("2026-05-01T17:00:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-done`),
    ).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`),
    ).toHaveTextContent("student2@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-done`),
    ).toHaveTextContent("true");
  });

  test("supports a custom testIdPrefix", () => {
    const customTestId = "CustomRecommendationRequestTable";

    renderTable({
      recommendationRequests:
        recommendationRequestFixtures.threeRecommendationRequests,
      testIdPrefix: customTestId,
    });

    expect(
      screen.getByTestId(`${customTestId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent("student1@ucsb.edu");
  });

  test("shows edit and delete buttons for admin users", () => {
    renderTable({
      recommendationRequests:
        recommendationRequestFixtures.threeRecommendationRequests,
      currentUser: currentUserFixtures.adminUser,
    });

    expect(screen.getByTestId(`${testId}-header-Edit`)).toHaveTextContent(
      "Edit",
    );
    expect(screen.getByTestId(`${testId}-header-Delete`)).toHaveTextContent(
      "Delete",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`),
    ).toHaveClass("btn-primary");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`),
    ).toHaveClass("btn-danger");
  });

  test("edit button navigates to edit page", () => {
    renderTable({
      recommendationRequests:
        recommendationRequestFixtures.threeRecommendationRequests,
      currentUser: currentUserFixtures.adminUser,
    });

    fireEvent.click(screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`));

    expect(mockNavigate).toHaveBeenCalledWith("/recommendationrequest/edit/1");
  });
});
