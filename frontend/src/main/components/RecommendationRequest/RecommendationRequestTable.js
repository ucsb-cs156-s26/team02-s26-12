import React from "react";
import OurTable from "main/components/OurTable";

export default function RecommendationRequestTable({
  recommendationRequests,
  testIdPrefix = "RecommendationRequestTable",
}) {
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

  return React.createElement(OurTable, {
    data: recommendationRequests,
    columns,
    testid: testIdPrefix,
  });
}
