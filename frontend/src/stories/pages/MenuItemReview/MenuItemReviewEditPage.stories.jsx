import React from "react";
import { Routes, Route } from "react-router";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

const reviewForEdit = {
  id: 17,
  itemId: 101,
  reviewerEmail: "cgaucho@ucsb.edu",
  stars: 5,
  dateReviewed: "2022-01-02T12:00:00",
  comments: "Best pizza at Carrillo",
};

export default {
  title: "pages/MenuItemReview/MenuItemReviewEditPage",
  component: MenuItemReviewEditPage,
};

// Uses preview MemoryRouter only; set initial route via parameters.router.initialEntries
const Template = () => (
  <Routes>
    <Route
      path="/menuitemreview/edit/:id"
      element={<MenuItemReviewEditPage storybook={true} />}
    />
  </Routes>
);

export const Default = Template.bind({});
Default.parameters = {
  router: {
    initialEntries: ["/menuitemreview/edit/17"],
  },
  msw: {
    handlers: [
      http.get("*/api/currentUser", () => {
        return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
          status: 200,
        });
      }),
      http.get("*/api/systemInfo", () => {
        return HttpResponse.json(systemInfoFixtures.showingNeither, {
          status: 200,
        });
      }),
      http.get("*/api/MenuItemReview", () => {
        return HttpResponse.json(reviewForEdit, {
          status: 200,
        });
      }),
      http.put("*/api/MenuItemReview", () => {
        return HttpResponse.json(
          {
            id: 17,
            itemId: 102,
            reviewerEmail: "cgaucho@ucsb.edu",
            stars: 4,
            dateReviewed: "2022-01-02T12:00:00",
            comments: "Updated comment",
          },
          { status: 200 },
        );
      }),
    ],
  },
};
