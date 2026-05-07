import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({ storybook = false }) {
  const objectToAxiosParams = (recommendationRequest) => ({
    url: "/api/RecommendationRequest/post",
    method: "POST",
    params: {
      requesterEmail: recommendationRequest.requesterEmail,
      professorEmail: recommendationRequest.professorEmail,
      explanation: recommendationRequest.explanation,
      dateRequested: recommendationRequest.dateRequested,
      dateNeeded: recommendationRequest.dateNeeded,
      done: recommendationRequest.done,
    },
  });

  const onSuccess = (recommendationRequest) => {
    toast(
      `New RecommendationRequest Created - id: ${recommendationRequest.id} requesterEmail: ${recommendationRequest.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/RecommendationRequest/all"],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return React.createElement(Navigate, { to: "/recommendationrequest" });
  }

  return React.createElement(
    BasicLayout,
    null,
    React.createElement(
      "div",
      { className: "pt-2" },
      React.createElement("h1", null, "Create New RecommendationRequest"),
      React.createElement(RecommendationRequestForm, {
        submitAction: onSubmit,
      }),
    ),
  );
}
