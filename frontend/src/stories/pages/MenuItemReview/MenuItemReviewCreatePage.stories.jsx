import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";

export default {
  title: "pages/MenuItemReview/MenuItemReviewCreatePage",
  component: MenuItemReviewCreatePage,
};

const Template = () => <MenuItemReviewCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
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
      http.post("*/api/MenuItemReview/post", () => {
        return HttpResponse.json(
          {
            id: 1,
            itemId: 101,
            reviewerEmail: "cgaucho@ucsb.edu",
            stars: 5,
            dateReviewed: "2022-01-02T12:00:00",
            comments: "Best pizza at Carrillo",
          },
          { status: 200 },
        );
      }),
    ],
  },
};
