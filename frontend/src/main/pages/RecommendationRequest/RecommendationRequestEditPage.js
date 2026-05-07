import React from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate, useParams } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({ storybook = false }) {
  const { id } = useParams();

  const {
    data: recommendationRequest,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/RecommendationRequest?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
      method: "GET",
      url: "/api/RecommendationRequest",
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (recommendationRequest) => ({
    url: "/api/RecommendationRequest",
    method: "PUT",
    params: {
      id: recommendationRequest.id,
    },
    data: {
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
      `RecommendationRequest Updated - id: ${recommendationRequest.id} requesterEmail: ${recommendationRequest.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/RecommendationRequest?id=${id}`],
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
      React.createElement("h1", null, "Edit RecommendationRequest"),
      recommendationRequest &&
        React.createElement(RecommendationRequestForm, {
          initialContents: recommendationRequest,
          submitAction: onSubmit,
          buttonLabel: "Update",
        }),
    ),
  );
}
