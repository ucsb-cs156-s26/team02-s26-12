import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function RecommendationRequestIndexPage() {
  // Stryker disable all : placeholder for future implementation
  return React.createElement(
    BasicLayout,
    null,
    React.createElement(
      "div",
      { className: "pt-2" },
      React.createElement("h1", null, "Index page not yet implemented"),
      React.createElement(
        "p",
        null,
        React.createElement(
          "a",
          { href: "/recommendationrequest/create" },
          "Create",
        ),
      ),
      React.createElement(
        "p",
        null,
        React.createElement(
          "a",
          { href: "/recommendationrequest/edit/1" },
          "Edit",
        ),
      ),
    ),
  );
}
