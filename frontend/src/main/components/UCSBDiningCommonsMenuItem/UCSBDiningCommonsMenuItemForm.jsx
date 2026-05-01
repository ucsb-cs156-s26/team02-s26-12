import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function UCSBDiningCommonsMenuItemForm({
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

  const testIdPrefix = "UCSBDiningCommonsMenuItemForm";

  const stringFieldRules = (label, maxLen = 255) => ({
    required: `${label} is required.`,
    maxLength: {
      value: maxLen,
      message: `${label} must be at most ${maxLen} characters.`,
    },
  });

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid={testIdPrefix + "-id"}
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                readOnly
              />
            </Form.Group>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="diningCommonsCode">
              Dining Commons Code
            </Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-diningCommonsCode"}
              id="diningCommonsCode"
              type="text"
              isInvalid={Boolean(errors.diningCommonsCode)}
              {...register(
                "diningCommonsCode",
                stringFieldRules("Dining Commons Code"),
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.diningCommonsCode?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-name"}
              id="name"
              type="text"
              isInvalid={Boolean(errors.name)}
              {...register("name", stringFieldRules("Name"))}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="station">Station</Form.Label>
            <Form.Control
              data-testid={testIdPrefix + "-station"}
              id="station"
              type="text"
              isInvalid={Boolean(errors.station)}
              {...register("station", stringFieldRules("Station"))}
            />
            <Form.Control.Feedback type="invalid">
              {errors.station?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid={testIdPrefix + "-submit"}>
            {buttonLabel}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            data-testid={testIdPrefix + "-cancel"}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default UCSBDiningCommonsMenuItemForm;
