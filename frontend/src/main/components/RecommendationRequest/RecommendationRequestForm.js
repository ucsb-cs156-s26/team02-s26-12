import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function RecommendationRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable next-line all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });

  const navigate = useNavigate();

  const testIdPrefix = "RecommendationRequestForm";
  const h = React.createElement;

  const feedback = (message) =>
    h(Form.Control.Feedback, { type: "invalid" }, message);

  const idField =
    initialContents &&
    h(
      Col,
      null,
      h(
        Form.Group,
        { className: "mb-3" },
        h(Form.Label, { htmlFor: "id" }, "Id"),
        h(Form.Control, {
          "data-testid": testIdPrefix + "-id",
          id: "id",
          type: "text",
          ...register("id"),
          value: initialContents.id,
          readOnly: true,
        }),
      ),
    );

  return h(
    Form,
    { onSubmit: handleSubmit(submitAction) },
    h(
      Row,
      null,
      idField,
      h(
        Col,
        null,
        h(
          Form.Group,
          { className: "mb-3" },
          h(Form.Label, { htmlFor: "requesterEmail" }, "Requester Email"),
          h(Form.Control, {
            "data-testid": testIdPrefix + "-requesterEmail",
            id: "requesterEmail",
            type: "email",
            isInvalid: Boolean(errors.requesterEmail),
            ...register("requesterEmail", {
              required: "Requester Email is required.",
            }),
          }),
          feedback(errors.requesterEmail?.message),
        ),
      ),
      h(
        Col,
        null,
        h(
          Form.Group,
          { className: "mb-3" },
          h(Form.Label, { htmlFor: "professorEmail" }, "Professor Email"),
          h(Form.Control, {
            "data-testid": testIdPrefix + "-professorEmail",
            id: "professorEmail",
            type: "email",
            isInvalid: Boolean(errors.professorEmail),
            ...register("professorEmail", {
              required: "Professor Email is required.",
            }),
          }),
          feedback(errors.professorEmail?.message),
        ),
      ),
    ),
    h(
      Row,
      null,
      h(
        Col,
        null,
        h(
          Form.Group,
          { className: "mb-3" },
          h(Form.Label, { htmlFor: "explanation" }, "Explanation"),
          h(Form.Control, {
            "data-testid": testIdPrefix + "-explanation",
            id: "explanation",
            as: "textarea",
            rows: 3,
            isInvalid: Boolean(errors.explanation),
            ...register("explanation", {
              required: "Explanation is required.",
            }),
          }),
          feedback(errors.explanation?.message),
        ),
      ),
    ),
    h(
      Row,
      null,
      h(
        Col,
        null,
        h(
          Form.Group,
          { className: "mb-3" },
          h(Form.Label, { htmlFor: "dateRequested" }, "Date Requested"),
          h(Form.Control, {
            "data-testid": testIdPrefix + "-dateRequested",
            id: "dateRequested",
            type: "datetime-local",
            isInvalid: Boolean(errors.dateRequested),
            ...register("dateRequested", {
              required: "Date Requested is required.",
            }),
          }),
          feedback(errors.dateRequested?.message),
        ),
      ),
      h(
        Col,
        null,
        h(
          Form.Group,
          { className: "mb-3" },
          h(Form.Label, { htmlFor: "dateNeeded" }, "Date Needed"),
          h(Form.Control, {
            "data-testid": testIdPrefix + "-dateNeeded",
            id: "dateNeeded",
            type: "datetime-local",
            isInvalid: Boolean(errors.dateNeeded),
            ...register("dateNeeded", {
              required: "Date Needed is required.",
            }),
          }),
          feedback(errors.dateNeeded?.message),
        ),
      ),
    ),
    h(
      Row,
      null,
      h(
        Col,
        null,
        h(
          Form.Group,
          { className: "mb-3" },
          h(Form.Check, {
            "data-testid": testIdPrefix + "-done",
            id: "done",
            label: "Done",
            type: "checkbox",
            ...register("done"),
          }),
        ),
      ),
    ),
    h(
      Row,
      null,
      h(
        Col,
        null,
        h(
          Button,
          { type: "submit", "data-testid": testIdPrefix + "-submit" },
          buttonLabel,
        ),
        h(
          Button,
          {
            variant: "secondary",
            onClick: () => navigate(-1),
            "data-testid": testIdPrefix + "-cancel",
          },
          "Cancel",
        ),
      ),
    ),
  );
}

export default RecommendationRequestForm;
