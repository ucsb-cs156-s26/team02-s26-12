import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable next-line all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );

    const navigate = useNavigate();

    const testIdPrefix = "MenuItemReviewForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            <Row>
                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
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

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="itemId">Item Id</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-itemId"}
                            id="itemId"
                            type="text"
                            isInvalid={Boolean(errors.itemId)}
                            {...register("itemId", { required: "Item Id is required." })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.itemId?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-reviewerEmail"}
                            id="reviewerEmail"
                            type="text"
                            isInvalid={Boolean(errors.reviewerEmail)}
                            {...register("reviewerEmail", { 
                                required: "Reviewer Email is required.",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Reviewer Email must be a valid email address"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.reviewerEmail?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="stars">Stars (1-5)</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-stars"}
                            id="stars"
                            type="number"
                            isInvalid={Boolean(errors.stars)}
                            {...register("stars", { 
                                required: "Stars are required.",
                                min: { value: 1, message: "Minimum rating is 1 star." },
                                max: { value: 5, message: "Maximum rating is 5 stars." }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.stars?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateReviewed">Date Reviewed (iso format)</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-dateReviewed"}
                            id="dateReviewed"
                            type="datetime-local"
                            isInvalid={Boolean(errors.dateReviewed)}
                            {...register("dateReviewed", { required: "Date Reviewed is required." })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateReviewed?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="comments">Comments</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-comments"}
                            id="comments"
                            type="text"
                            isInvalid={Boolean(errors.comments)}
                            {...register("comments", { required: "Comments are required." })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.comments?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid={testIdPrefix + "-submit"}
                    >
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

export default MenuItemReviewForm;