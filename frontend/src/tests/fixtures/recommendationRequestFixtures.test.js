import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

describe("recommendationRequestFixtures tests", () => {
  test("fixtures have the expected contents", () => {
    expect(recommendationRequestFixtures).toEqual({
      oneRecommendationRequest: {
        id: 1,
        requesterEmail: "student1@ucsb.edu",
        professorEmail: "professor1@ucsb.edu",
        explanation: "Request for a graduate school recommendation letter",
        dateRequested: "2026-04-20T10:15:30",
        dateNeeded: "2026-05-01T17:00:00",
        done: false,
      },

      threeRecommendationRequests: [
        {
          id: 1,
          requesterEmail: "student1@ucsb.edu",
          professorEmail: "professor1@ucsb.edu",
          explanation: "Request for a graduate school recommendation letter",
          dateRequested: "2026-04-20T10:15:30",
          dateNeeded: "2026-05-01T17:00:00",
          done: false,
        },
        {
          id: 2,
          requesterEmail: "student2@ucsb.edu",
          professorEmail: "professor2@ucsb.edu",
          explanation: "Recommendation needed for a summer research internship",
          dateRequested: "2026-04-22T09:30:00",
          dateNeeded: "2026-05-08T12:00:00",
          done: true,
        },
        {
          id: 3,
          requesterEmail: "student3@ucsb.edu",
          professorEmail: "professor3@ucsb.edu",
          explanation: "Letter request for a scholarship application",
          dateRequested: "2026-04-25T14:45:00",
          dateNeeded: "2026-05-15T23:59:00",
          done: false,
        },
      ],
    });
  });
});
