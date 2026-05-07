import React from "react";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

export default {
  title: "components/RecommendationRequest/RecommendationRequestTable",
  component: RecommendationRequestTable,
};

const Template = (args) => {
  return React.createElement(RecommendationRequestTable, args);
};

export const Empty = Template.bind({});

Empty.args = {
  recommendationRequests: [],
};

export const ThreeItems = Template.bind({});

ThreeItems.args = {
  recommendationRequests:
    recommendationRequestFixtures.threeRecommendationRequests,
};
