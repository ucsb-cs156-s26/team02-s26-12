import { recommendationRequestFixtures } from "main/fixtures/recommendationRequestFixtures";

describe("recommendationRequestFixtures tests", () => {
  test("oneRecommendationRequest has expected fields", () => {
    expect(
      recommendationRequestFixtures.oneRecommendationRequest,
    ).toMatchObject({
      id: 1,
      requesterEmail: "student1@ucsb.edu",
      professorEmail: "professor1@ucsb.edu",
      explanation: "Request for a graduate school recommendation letter",
      dateRequested: "2026-04-20T10:15:30",
      dateNeeded: "2026-05-01T17:00:00",
      done: false,
    });
  });

  test("threeRecommendationRequests has three entries", () => {
    expect(
      recommendationRequestFixtures.threeRecommendationRequests,
    ).toHaveLength(3);
  });
});
