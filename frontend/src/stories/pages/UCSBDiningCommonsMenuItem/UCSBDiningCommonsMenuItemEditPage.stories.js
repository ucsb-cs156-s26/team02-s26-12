import React from "react";
import { Route, Routes } from "react-router";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

export default {
  title: "pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage",
  component: UCSBDiningCommonsMenuItemEditPage,
};

const Template = () =>
  React.createElement(
    Routes,
    null,
    React.createElement(Route, {
      path: "/diningcommonsmenuitem/edit/:id",
      element: React.createElement(UCSBDiningCommonsMenuItemEditPage, {
        storybook: true,
      }),
    }),
  );

export const Default = Template.bind({});
Default.parameters = {
  memoryRouter: {
    initialEntries: ["/diningcommonsmenuitem/edit/1"],
  },
  msw: {
    handlers: [
      http.get("/api/currentUser", () => {
        return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
          status: 200,
        });
      }),
      http.get("/api/systemInfo", () => {
        return HttpResponse.json(systemInfoFixtures.showingNeither, {
          status: 200,
        });
      }),
      http.get("/api/ucsbdiningcommonsmenuitem", () => {
        return HttpResponse.json(ucsbDiningCommonsMenuItemFixtures.oneItem, {
          status: 200,
        });
      }),
      http.put("/api/ucsbdiningcommonsmenuitem", () => {
        return HttpResponse.json(
          {
            id: 1,
            diningCommonsCode: "carrillo",
            name: "Baked Ziti",
            station: "Entrees",
          },
          { status: 200 },
        );
      }),
    ],
  },
};
