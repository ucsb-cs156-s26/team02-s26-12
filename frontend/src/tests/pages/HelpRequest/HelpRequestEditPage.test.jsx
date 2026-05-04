import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
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
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("HelpRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(screen.queryByTestId("HelpRequest-name")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "lzucca@ucsb.edu",
        teamId: "12",
        tableOrBreakoutRoom: "12",
        requestTime: "2026-04-30T20:10:00",
        explanation: "did stuff",
        solved: false,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: "17",
        requesterEmail: "lzucca1@ucsb.edu",
        teamId: "13",
        tableOrBreakoutRoom: "13",
        requestTime: "2026-04-29T20:10:00",
        explanation: "changed message",
        solved: true,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
      const teamIdField = screen.getByLabelText("Team Id");
      const tableOrBreakoutRoomField = screen.getByLabelText("Table or Breakout Room");
      const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved");
      const submitButton = screen.getByRole("button", { name: "Update" });

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("lzucca@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("12");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("12");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2026-04-30T20:10");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("did stuff");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).not.toBeChecked();

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "lzucca1@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "13" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "13" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2026-04-29T20:10:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "changed message" },
      });
      fireEvent.click(solvedField);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Help Request Updated - id: 17 requesterEmail: lzucca1@ucsb.edu",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "lzucca1@ucsb.edu",
          teamId: "13",
          tableOrBreakoutRoom: "13",
          requestTime: "2026-04-29T20:10",
          explanation: "changed message",
          solved: true,
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
      const teamIdField = screen.getByLabelText("Team Id");
      const tableOrBreakoutRoomField = screen.getByLabelText("Table or Breakout Room");
      const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved");
      const submitButton = screen.getByRole("button", { name: "Update" });

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("lzucca@ucsb.edu");
      expect(teamIdField).toHaveValue("12");
      expect(tableOrBreakoutRoomField).toHaveValue("12");
      expect(requestTimeField).toHaveValue("2026-04-30T20:10");
      expect(explanationField).toHaveValue("did stuff");
      expect(solvedField).not.toBeChecked();
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(requesterEmailField, {
        target: { value: "lzucca1@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "13" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "13" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2026-04-29T20:10:00" },
      });
      fireEvent.change(explanationField, {
        target: { value: "changed message" },
      });
      fireEvent.change(solvedField, {
        target: { value: true },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Help Request Updated - id: 17 requesterEmail: lzucca1@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequest" });
    });
  });
});
