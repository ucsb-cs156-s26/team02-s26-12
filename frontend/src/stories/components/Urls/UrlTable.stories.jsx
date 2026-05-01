import React from "react";
import UrlTable from "main/components/Urls/UrlTable";
import { urlFixtures } from "fixtures/urlFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/Urls/UrlTable",
  component: UrlTable,
};

const Template = (args) => {
  return <UrlTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  urls: urlFixtures.empty,
  currentUser: currentUserFixtures.userOnly,
};

export const FourItemsOrdinaryUser = Template.bind({});

FourItemsOrdinaryUser.args = {
  urls: urlFixtures.fourUrls,
  currentUser: currentUserFixtures.userOnly,
};

export const FourItemsAdminUser = Template.bind({});
FourItemsAdminUser.args = {
  urls: urlFixtures.fourUrls,
  currentUser: currentUserFixtures.adminUser,
};

FourItemsAdminUser.parameters = {
  msw: {
    handlers: [
    http.delete("/api/restaurants", () => {
      return HttpResponse.json(
        { message: "Url deleted successfully" },
        { status: 200 },
      );
    }),
  ],
  },
};
