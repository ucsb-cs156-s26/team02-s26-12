import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";
import { vi } from "vitest";

import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("RecommendationRequestForm tests", () => {
  const testId = "RecommendationRequestForm";
  const h = React.createElement;

  const initialContents = {
    id: 1,
    requesterEmail: "student1@ucsb.edu",
    professorEmail: "professor1@ucsb.edu",
    explanation: "Request for a graduate school recommendation letter",
    dateRequested: "2026-04-20T10:15:30",
    dateNeeded: "2026-05-01T17:00:00",
    done: true,
  };

  const renderForm = (props = {}) =>
    render(h(Router, null, h(RecommendationRequestForm, props)));

  test("renders correctly with no initialContents", async () => {
    renderForm();

    expect(screen.getByText(/Requester Email/)).toBeInTheDocument();
    expect(screen.getByText(/Professor Email/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation/)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested/)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed/)).toBeInTheDocument();
    expect(screen.getByText(/Done/)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toHaveTextContent("Create");
    expect(screen.getByTestId(`${testId}-cancel`)).toHaveTextContent("Cancel");
  });

  test("create mode does not show id", async () => {
    renderForm();

    expect(screen.queryByTestId(`${testId}-id`)).not.toBeInTheDocument();
  });

  test("edit mode shows id as read-only and prepopulates fields", async () => {
    renderForm({ initialContents });

    expect(screen.getByTestId(`${testId}-id`)).toHaveValue("1");
    expect(screen.getByTestId(`${testId}-id`)).toHaveAttribute("readonly");
    expect(screen.getByLabelText("Id")).toBe(
      screen.getByTestId(`${testId}-id`),
    );
    expect(screen.getByTestId(`${testId}-id`)).toHaveAttribute("type", "text");
    expect(screen.getByTestId(`${testId}-requesterEmail`)).toHaveValue(
      initialContents.requesterEmail,
    );
    expect(screen.getByTestId(`${testId}-professorEmail`)).toHaveValue(
      initialContents.professorEmail,
    );
    expect(screen.getByTestId(`${testId}-explanation`)).toHaveValue(
      initialContents.explanation,
    );
    expect(screen.getByTestId(`${testId}-dateRequested`)).toHaveValue(
      "2026-04-20T10:15:30.000",
    );
    expect(screen.getByTestId(`${testId}-dateNeeded`)).toHaveValue(
      "2026-05-01T17:00",
    );
    expect(screen.getByTestId(`${testId}-done`)).toBeChecked();
  });

  test("uses accessible labels and expected input attributes", async () => {
    renderForm();

    expect(screen.getByLabelText("Requester Email")).toBe(
      screen.getByTestId(`${testId}-requesterEmail`),
    );
    expect(screen.getByLabelText("Professor Email")).toBe(
      screen.getByTestId(`${testId}-professorEmail`),
    );
    expect(screen.getByLabelText("Explanation")).toBe(
      screen.getByTestId(`${testId}-explanation`),
    );
    expect(screen.getByLabelText("Date Requested")).toBe(
      screen.getByTestId(`${testId}-dateRequested`),
    );
    expect(screen.getByLabelText("Date Needed")).toBe(
      screen.getByTestId(`${testId}-dateNeeded`),
    );
    expect(screen.getByLabelText("Done")).toBe(
      screen.getByTestId(`${testId}-done`),
    );

    expect(screen.getByTestId(`${testId}-requesterEmail`)).toHaveAttribute(
      "type",
      "email",
    );
    expect(screen.getByTestId(`${testId}-professorEmail`)).toHaveAttribute(
      "type",
      "email",
    );
    expect(screen.getByTestId(`${testId}-dateRequested`)).toHaveAttribute(
      "type",
      "datetime-local",
    );
    expect(screen.getByTestId(`${testId}-dateNeeded`)).toHaveAttribute(
      "type",
      "datetime-local",
    );
    expect(screen.getByTestId(`${testId}-done`)).toHaveAttribute(
      "type",
      "checkbox",
    );
    expect(screen.getByTestId(`${testId}-submit`)).toHaveAttribute(
      "type",
      "submit",
    );
    expect(screen.getByTestId(`${testId}-cancel`)).toHaveClass("btn-secondary");
  });

  test("form controls are laid out with bootstrap spacing classes", async () => {
    renderForm({ initialContents });

    [
      "id",
      "requesterEmail",
      "professorEmail",
      "explanation",
      "dateRequested",
      "dateNeeded",
      "done",
    ].forEach((fieldName) => {
      expect(
        screen.getByTestId(`${testId}-${fieldName}`).closest(".mb-3"),
      ).toHaveClass("mb-3");
    });
  });

  test("renders correctly with a custom button label", async () => {
    renderForm({ buttonLabel: "Update" });

    expect(screen.getByTestId(`${testId}-submit`)).toHaveTextContent("Update");
  });

  test("shows validation messages for missing required fields", async () => {
    renderForm();

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    expect(
      await screen.findByText(/Requester Email is required./),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Professor Email is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Requested is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Needed is required./)).toBeInTheDocument();
    [
      "Requester Email is required.",
      "Professor Email is required.",
      "Explanation is required.",
      "Date Requested is required.",
      "Date Needed is required.",
    ].forEach((message) => {
      expect(screen.getByText(message)).toHaveClass("invalid-feedback");
    });
  });

  test("submits form with valid create data", async () => {
    const submitAction = vi.fn();
    renderForm({ submitAction });

    fireEvent.change(screen.getByTestId(`${testId}-requesterEmail`), {
      target: { value: "student2@ucsb.edu" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-professorEmail`), {
      target: { value: "professor2@ucsb.edu" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-explanation`), {
      target: { value: "Recommendation needed for a research internship" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-dateRequested`), {
      target: { value: "2026-04-22T09:30" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-dateNeeded`), {
      target: { value: "2026-05-08T12:00" },
    });
    fireEvent.click(screen.getByTestId(`${testId}-done`));

    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    await waitFor(() => expect(submitAction).toHaveBeenCalled());
    expect(submitAction.mock.calls[0][0]).toMatchObject({
      requesterEmail: "student2@ucsb.edu",
      professorEmail: "professor2@ucsb.edu",
      explanation: "Recommendation needed for a research internship",
      dateRequested: "2026-04-22T09:30",
      dateNeeded: "2026-05-08T12:00",
      done: true,
    });
  });

  test("that the Cancel button navigates back", async () => {
    renderForm();

    fireEvent.click(screen.getByTestId(`${testId}-cancel`));

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
