import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("RecommendationRequestCreatePage tests", () => {
  const h = React.createElement;
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

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

  test("renders expected content", async () => {
    setupUserOnly();

    renderPage();

    await screen.findByText("Create page not yet implemented");
    expect(
      screen.getByText("Create page not yet implemented"),
    ).toBeInTheDocument();
  });
});
