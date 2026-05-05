import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBOrganizationForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
    await screen.findByText(/Organization Code/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Short Translation/)).toBeInTheDocument();
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <Router>
        <UCSBOrganizationForm
          initialContents={ucsbOrganizationFixtures.oneOrganization}
        />
      </Router>,
    );
    await screen.findByTestId(/UCSBOrganizationForm-orgCode/);
    expect(screen.getByText(/Organization Code/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBOrganizationForm-orgCode/)).toHaveValue(
      "OSLI",
    );
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
    await screen.findByTestId("UCSBOrganizationForm-submit");
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Organization Code is required./);
    expect(
      screen.getByText(/Short Translation is required./),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Full Translation is required./),
    ).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <UCSBOrganizationForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("UCSBOrganizationForm-orgCode");

    const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
    const shortField = screen.getByTestId(
      "UCSBOrganizationForm-orgTranslationShort",
    );
    const fullField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
    const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
    const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

    fireEvent.change(orgCodeField, { target: { value: "ZPR" } });
    fireEvent.change(shortField, { target: { value: "Zeta Phi Rho" } });
    fireEvent.change(fullField, { target: { value: "Zeta Phi Rho at UCSB" } });
    fireEvent.change(inactiveField, { target: { value: "false" } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(screen.queryByText(/is required/)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBOrganizationForm />
      </Router>,
    );
    await screen.findByTestId("UCSBOrganizationForm-cancel");
    const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
