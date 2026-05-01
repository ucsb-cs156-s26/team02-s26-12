import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { BrowserRouter as Router } from "react-router";
import { vi } from "vitest";

const oneMenuItem = {
  id: 7,
  diningCommonsCode: "ortega",
  name: "Chicken Caesar Salad",
  station: "Entrees",
};

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  const testId = "UCSBDiningCommonsMenuItemForm";

  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    expect(screen.getByText(/Dining Commons Code/)).toBeInTheDocument();
    expect(screen.getByText(/^Name$/)).toBeInTheDocument();
    expect(screen.getByText(/Station/)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toHaveTextContent("Create");
  });

  test("renders correctly with a custom button label", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm buttonLabel="Update Menu Item" />
      </Router>,
    );
    expect(screen.getByText(/Update Menu Item/)).toBeInTheDocument();
  });

  test("Correct error messages on missing input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    expect(
      await screen.findByText(/Dining Commons Code is required./),
    ).toBeInTheDocument();
    expect(screen.getByText(/Name is required./)).toBeInTheDocument();
    expect(screen.getByText(/Station is required./)).toBeInTheDocument();
  });

  test("rejects fields longer than 255 characters", async () => {
    const long = "a".repeat(256);
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );

    fireEvent.change(screen.getByTestId(`${testId}-diningCommonsCode`), {
      target: { value: long },
    });
    fireEvent.change(screen.getByTestId(`${testId}-name`), {
      target: { value: long },
    });
    fireEvent.change(screen.getByTestId(`${testId}-station`), {
      target: { value: long },
    });
    fireEvent.click(screen.getByTestId(`${testId}-submit`));

    const msgs = await screen.findAllByText(/must be at most 255 characters/);
    expect(msgs.length).toBeGreaterThanOrEqual(1);
  });

  test("that the Cancel button navigates back", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    fireEvent.click(screen.getByTestId(`${testId}-cancel`));
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  test("renders correctly with initial contents", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm initialContents={oneMenuItem} />
      </Router>,
    );
    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-id`).value).toBe(
      String(oneMenuItem.id),
    );
    expect(screen.getByTestId(`${testId}-diningCommonsCode`).value).toBe(
      oneMenuItem.diningCommonsCode,
    );
    expect(screen.getByTestId(`${testId}-name`).value).toBe(oneMenuItem.name);
    expect(screen.getByTestId(`${testId}-station`).value).toBe(
      oneMenuItem.station,
    );
  });

  test("submits form with valid data", async () => {
    const submitAction = vi.fn();
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm submitAction={submitAction} />
      </Router>,
    );

    fireEvent.change(screen.getByTestId(`${testId}-diningCommonsCode`), {
      target: { value: "carrillo" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-name`), {
      target: { value: "Oatmeal" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-station`), {
      target: { value: "Breakfast" },
    });

    fireEvent.click(screen.getByTestId(`${testId}-submit`));
    await waitFor(() => expect(submitAction).toHaveBeenCalled());
  });
});
