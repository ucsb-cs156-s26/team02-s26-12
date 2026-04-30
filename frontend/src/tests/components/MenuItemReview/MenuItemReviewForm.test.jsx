import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router";
import { vi } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  const testId = "MenuItemReviewForm";

  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    expect(screen.getByText(/Item Id/)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toHaveTextContent("Create");
  });

  test("renders correctly with a custom button label", async () => {
    render(
      <Router>
        <MenuItemReviewForm buttonLabel="Update Review" />
      </Router>,
    );
    expect(screen.getByText(/Update Review/)).toBeInTheDocument();
  });

  test("Correct error messages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    expect(await screen.findByText(/Item Id is required./)).toBeInTheDocument();
    expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Stars are required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
    expect(screen.getByText(/Comments are required./)).toBeInTheDocument();
  });

  test("rejects invalid reviewer email", async () => {
    const submitAction = vi.fn();
    render(
      <Router>
        <MenuItemReviewForm submitAction={submitAction} />
      </Router>,
    );
    const emailField = screen.getByTestId(`${testId}-reviewerEmail`);
    const submitButton = screen.getByTestId(`${testId}-submit`);
    const itemIdField = screen.getByTestId(`${testId}-itemId`);
    const starsField = screen.getByTestId(`${testId}-stars`);
    const dateReviewedField = screen.getByTestId(`${testId}-dateReviewed`);
    const commentsField = screen.getByTestId(`${testId}-comments`);

    fireEvent.change(itemIdField, { target: { value: "123" } });
    fireEvent.change(starsField, { target: { value: "4" } });
    fireEvent.change(dateReviewedField, {
      target: { value: "2026-04-30T15:00" },
    });
    fireEvent.change(commentsField, { target: { value: "Great selection!" } });

    fireEvent.change(emailField, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(/Reviewer Email must be a valid email address/),
    ).toBeInTheDocument();
    expect(submitAction).not.toHaveBeenCalled();

    fireEvent.change(emailField, { target: { value: " arjun@ucsb.edu" } });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(/Reviewer Email must be a valid email address/),
    ).toBeInTheDocument();
    expect(submitAction).not.toHaveBeenCalled();

    fireEvent.change(emailField, { target: { value: "arjun@ucsb.edu extra" } });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(/Reviewer Email must be a valid email address/),
    ).toBeInTheDocument();
    expect(submitAction).not.toHaveBeenCalled();
  });

  test("Correct error messages on stars boundaries", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    const starsField = screen.getByTestId(`${testId}-stars`);
    const submitButton = screen.getByTestId(`${testId}-submit`);

    fireEvent.change(starsField, { target: { value: "0" } });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(/Minimum rating is 1 star./),
    ).toBeInTheDocument();

    fireEvent.change(starsField, { target: { value: "6" } });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText(/Maximum rating is 5 stars./),
    ).toBeInTheDocument();
  });

  test("that the Cancel button navigates back", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    fireEvent.click(screen.getByTestId(`${testId}-cancel`));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  test("renders correctly with initial contents", async () => {
    render(
      <Router>
        <MenuItemReviewForm
          initialContents={menuItemReviewFixtures.oneReview}
        />
      </Router>,
    );
    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    const expectedIdValue =
      menuItemReviewFixtures.oneReview.id === undefined
        ? ""
        : String(menuItemReviewFixtures.oneReview.id);
    const expectedItemIdValue =
      menuItemReviewFixtures.oneReview.itemId === undefined
        ? ""
        : String(menuItemReviewFixtures.oneReview.itemId);
    const expectedReviewerEmailValue =
      menuItemReviewFixtures.oneReview.reviewerEmail ?? "";
    const expectedStarsValue =
      menuItemReviewFixtures.oneReview.stars === undefined
        ? ""
        : String(menuItemReviewFixtures.oneReview.stars);
    const expectedCommentsValue =
      menuItemReviewFixtures.oneReview.comments ?? "";
    expect(screen.getByTestId(`${testId}-id`).value).toBe(expectedIdValue);
    expect(screen.getByTestId(`${testId}-itemId`).value).toBe(
      expectedItemIdValue,
    );
    expect(screen.getByTestId(`${testId}-reviewerEmail`).value).toBe(
      expectedReviewerEmailValue,
    );
    expect(screen.getByTestId(`${testId}-stars`).value).toBe(
      expectedStarsValue,
    );
    expect(screen.getByTestId(`${testId}-comments`).value).toBe(
      expectedCommentsValue,
    );
  });

  test("submits form with valid data", async () => {
    const submitAction = vi.fn();
    render(
      <Router>
        <MenuItemReviewForm submitAction={submitAction} />
      </Router>,
    );

    fireEvent.change(screen.getByTestId(`${testId}-itemId`), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-reviewerEmail`), {
      target: { value: "arjun@ucsb.edu" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-stars`), {
      target: { value: "4" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-dateReviewed`), {
      target: { value: "2026-04-30T15:00" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-comments`), {
      target: { value: "Great selection!" },
    });

    fireEvent.click(screen.getByTestId(`${testId}-submit`));
    await waitFor(() => expect(submitAction).toHaveBeenCalled());
  });
});
