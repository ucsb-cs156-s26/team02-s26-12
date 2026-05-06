import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, it makes a request to the backend and redirects", async () => {

        const queryClient = new QueryClient();
        const organization = {
            orgCode: "ZPR",
            orgTranslationShort: "Zeta Phi Rho",
            orgTranslation: "Zeta Phi Rho - UCSB",
            inactive: "false"
        };

        axiosMock.onPost("/api/ucsborganization/post").reply(202, organization);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Org Code")).toBeInTheDocument();
        });

        const orgCodeInput = screen.getByLabelText("Org Code");
        const orgTranslationShortInput = screen.getByLabelText("Org Translation Short");
        const orgTranslationInput = screen.getByLabelText("Org Translation");
        const inactiveInput = screen.getByLabelText("Inactive");
        const createButton = screen.getByText("Create");

        fireEvent.change(orgCodeInput, { target: { value: 'ZPR' } });
        fireEvent.change(orgTranslationShortInput, { target: { value: 'Zeta Phi Rho' } });
        fireEvent.change(orgTranslationInput, { target: { value: 'Zeta Phi Rho - UCSB' } });
        fireEvent.change(inactiveInput, { target: { value: 'false' } });
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            orgCode: "ZPR",
            orgTranslationShort: "Zeta Phi Rho",
            orgTranslation: "Zeta Phi Rho - UCSB",
            inactive: "false"
        });

        expect(mockToast).toBeCalledWith("New organization Created - orgCode: ZPR");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });
    });
});