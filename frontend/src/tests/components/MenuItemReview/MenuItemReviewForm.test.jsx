import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );

    expect(await screen.findByText(/Item Id/)).toBeInTheDocument();
    expect(await screen.findByText(/Create/)).toBeInTheDocument();
  });

  test("renders correctly when passing in a MenuItemReview", async () => {
    render(
      <Router>
        <MenuItemReviewForm
          initialContents={menuItemReviewFixtures.oneReview}
        />
      </Router>,
    );

    expect(
      await screen.findByTestId("MenuItemReviewForm-id"),
    ).toBeInTheDocument();
    // Fixed: Use ^ and $ to match "Id" exactly and avoid matching "Item Id"
    expect(screen.getByText(/^Id$/)).toBeInTheDocument();
    expect(screen.getByTestId("MenuItemReviewForm-id")).toHaveValue("1");

    expect(screen.getByTestId("MenuItemReviewForm-itemId")).toHaveValue("104");
    expect(screen.getByTestId("MenuItemReviewForm-reviewerEmail")).toHaveValue(
      "student@ucsb.edu",
    );
    expect(screen.getByTestId("MenuItemReviewForm-stars")).toHaveValue(4);
    expect(screen.getByTestId("MenuItemReviewForm-dateReviewed")).toHaveValue(
      "2022-05-05T12:00",
    );
    expect(screen.getByTestId("MenuItemReviewForm-comments")).toHaveValue(
      "Pretty good",
    );
  });

  test("Correct error messages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    const submitButton = await screen.findByTestId("MenuItemReviewForm-submit");

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Item Id is required./)).toBeInTheDocument();
    expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Stars are required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
    expect(screen.getByText(/Comments are required./)).toBeInTheDocument();
  });

  test("Correct error messages on bad input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    const emailField = await screen.findByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(emailField, { target: { value: "bad-email" } });
    fireEvent.change(starsField, { target: { value: "6" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Reviewer Email must be a valid email address./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Maximum rating is 5 stars./)).toBeInTheDocument();

    fireEvent.change(starsField, { target: { value: "0" } });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(/Minimum rating is 1 star./),
    ).toBeInTheDocument();
  });

  test("trigger settlement on submit", async () => {
    const submitAction = vi.fn();

    render(
      <Router>
        <MenuItemReviewForm submitAction={submitAction} />
      </Router>,
    );

    const itemIdField = await screen.findByTestId("MenuItemReviewForm-itemId");
    const reviewerEmailField = screen.getByTestId(
      "MenuItemReviewForm-reviewerEmail",
    );
    const starsField = screen.getByTestId("MenuItemReviewForm-stars");
    const dateReviewedField = screen.getByTestId(
      "MenuItemReviewForm-dateReviewed",
    );
    const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
    const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    fireEvent.change(itemIdField, { target: { value: "123" } });
    fireEvent.change(reviewerEmailField, {
      target: { value: "test@ucsb.edu" },
    });
    fireEvent.change(starsField, { target: { value: "5" } });
    fireEvent.change(dateReviewedField, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(commentsField, { target: { value: "Great food!" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(submitAction).toHaveBeenCalled());

    expect(submitAction).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: "123",
        reviewerEmail: "test@ucsb.edu",
        stars: "5",
        dateReviewed: "2022-01-02T12:00",
        comments: "Great food!",
      }),
      expect.anything(),
    );
  });

  test("that the Cancel button navigates back", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    const cancelButton = await screen.findByTestId("MenuItemReviewForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
