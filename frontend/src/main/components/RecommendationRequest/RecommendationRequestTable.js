import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { hasRole } from "main/utils/useCurrentUser";
import { toast } from "react-toastify";
import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router";

export default function RecommendationRequestTable({
  recommendationRequests,
  currentUser,
  testIdPrefix = "RecommendationRequestTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/recommendationrequest/edit/${cell.row.original.id}`);
  };

  const cellToAxiosParamsDelete = (cell) => ({
    url: "/api/RecommendationRequest",
    method: "DELETE",
    params: {
      id: cell.row.original.id,
    },
  });

  const onDeleteSuccess = (message) => {
    toast(message);
  };

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/RecommendationRequest/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : hard to test mutation internals here
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      header: "id",
      accessorKey: "id",
    },
    {
      header: "Requester Email",
      accessorKey: "requesterEmail",
    },
    {
      header: "Professor Email",
      accessorKey: "professorEmail",
    },
    {
      header: "Explanation",
      accessorKey: "explanation",
    },
    {
      header: "Date Requested",
      accessorKey: "dateRequested",
    },
    {
      header: "Date Needed",
      accessorKey: "dateNeeded",
    },
    {
      header: "Done",
      accessorKey: "done",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return React.createElement(OurTable, {
    data: recommendationRequests,
    columns,
    testid: testIdPrefix,
  });
}
