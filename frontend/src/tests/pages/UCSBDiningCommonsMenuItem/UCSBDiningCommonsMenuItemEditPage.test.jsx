import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";
import { beforeEach, afterEach } from "vitest";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigateRoute = vi.fn();
const mockNavigateFn = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      id: 17,
    })),
    useNavigate: () => mockNavigateFn,
    Navigate: vi.fn((x) => {
      mockNavigateRoute(x);
      return null;
    }),
  };
});

let axiosMock;
describe("UCSBDiningCommonsMenuItemEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/ucsbdiningcommonsmenuitem", { params: { id: 17 } })
        .timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigateRoute.mockClear();
      mockNavigateFn.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText(/Welcome/);
      await screen.findByText("Edit UCSBDiningCommonsMenuItem");
      expect(
        screen.queryByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
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
        .onGet("/api/ucsbdiningcommonsmenuitem", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          diningCommonsCode: "carrillo",
          name: "Baked Ziti",
          station: "Entrees",
        });
      axiosMock.onPut("/api/ucsbdiningcommonsmenuitem").reply(200, {
        id: 17,
        diningCommonsCode: "dlg",
        name: "Lasagna",
        station: "Hot Line",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigateRoute.mockClear();
      mockNavigateFn.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText(/Welcome/);
      await screen.findByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );
      expect(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode"),
      ).toBeInTheDocument();
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const diningCommonsCodeField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );
      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      const stationField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-station",
      );
      const submitButton = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-submit",
      );

      expect(idField).toHaveValue("17");
      expect(diningCommonsCodeField).toHaveValue("carrillo");
      expect(nameField).toHaveValue("Baked Ziti");
      expect(stationField).toHaveValue("Entrees");
      expect(submitButton).toHaveTextContent("Update");
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );

      const diningCommonsCodeField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
      );
      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      const stationField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-station",
      );
      const submitButton = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-submit",
      );

      fireEvent.change(diningCommonsCodeField, { target: { value: "dlg" } });
      fireEvent.change(nameField, { target: { value: "Lasagna" } });
      fireEvent.change(stationField, { target: { value: "Hot Line" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSBDiningCommonsMenuItem Updated - id: 17 name: Lasagna",
      );
      expect(mockNavigateRoute).toBeCalledWith({
        to: "/diningcommonsmenuitem",
      });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          diningCommonsCode: "dlg",
          name: "Lasagna",
          station: "Hot Line",
        }),
      );
    });

    test("when invalid data is submitted, shows validation errors and does not put", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-name");

      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      fireEvent.change(nameField, { target: { value: "" } });

      fireEvent.click(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit"),
      );

      await waitFor(() => {
        expect(screen.getByText("Name is required.")).toBeInTheDocument();
      });

      expect(axiosMock.history.put.length).toBe(0);
      expect(mockNavigateRoute).not.toBeCalled();
    });

    test("Cancel navigates back without saving", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-cancel");

      const nameField = screen.getByTestId(
        "UCSBDiningCommonsMenuItemForm-name",
      );
      fireEvent.change(nameField, { target: { value: "Should not save" } });

      fireEvent.click(
        screen.getByTestId("UCSBDiningCommonsMenuItemForm-cancel"),
      );

      expect(mockNavigateFn).toHaveBeenCalledWith(-1);
      expect(axiosMock.history.put.length).toBe(0);
      expect(mockNavigateRoute).not.toBeCalled();
    });
  });
});
