import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { useBackend } from "main/utils/useBackend";
import { hasRole, useCurrentUser } from "main/utils/useCurrentUser";
import { Button } from "react-bootstrap";

export default function RecommendationRequestIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: recommendationRequests,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/RecommendationRequest/all"],
    { method: "GET", url: "/api/RecommendationRequest/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return React.createElement(
        Button,
        {
          variant: "primary",
          href: "/recommendationrequest/create",
          style: { float: "right" },
        },
        "Create RecommendationRequest",
      );
    }
  };

  return React.createElement(
    BasicLayout,
    null,
    React.createElement(
      "div",
      { className: "pt-2" },
      createButton(),
      React.createElement("h1", null, "RecommendationRequests"),
      React.createElement(RecommendationRequestTable, {
        recommendationRequests,
        currentUser,
      }),
    ),
  );
}
