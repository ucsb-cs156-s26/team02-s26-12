import React from "react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

export default {
  title: "components/MenuItemReview/MenuItemReviewForm",
  component: MenuItemReviewForm,
};

const Template = (args) => {
  return <MenuItemReviewForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("MenuItemReviewForm.Create submitted with data:", data);
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: menuItemReviewFixtures.oneReview,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("MenuItemReviewForm.Update submitted with data:", data);
  },
};
