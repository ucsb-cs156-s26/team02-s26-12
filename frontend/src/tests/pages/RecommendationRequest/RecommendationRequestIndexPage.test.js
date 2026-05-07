import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("RecommendationRequestIndexPage tests", () => {
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
        h(MemoryRouter, null, h(RecommendationRequestIndexPage)),
      ),
    );
  };

  test("renders expected content", async () => {
    setupUserOnly();

    renderPage();

    await screen.findByText("Index page not yet implemented");

    expect(
      screen.getByText("Index page not yet implemented"),
    ).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Create")).toHaveAttribute(
      "href",
      "/recommendationrequest/create",
    );
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toHaveAttribute(
      "href",
      "/recommendationrequest/edit/1",
    );
  });
});
