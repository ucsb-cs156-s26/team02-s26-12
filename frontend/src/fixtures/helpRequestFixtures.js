const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "lzucca@ucsb.edu",
    teamId: "12",
    tableOrBreakoutRoom: "12",
    requestTime: "2026-04-30T20:10:00",
    explanation: "did stuff",
    solved: false,
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "lzucca@ucsb.edu",
      teamId: "12",
      tableOrBreakoutRoom: "12",
      requestTime: "2026-04-30T20:10:00",
      explanation: "did stuff",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "alicia_g@ucsb.edu",
      teamId: "1",
      tableOrBreakoutRoom: "1",
      requestTime: "2026-04-30T14:45:00",
      explanation:
        "My frontend tests are failing with a 'React component not found' error when running npm test.",
      solved: true,
    },
    {
      id: 4,
      requesterEmail: "marc_t@ucsb.edu",
      teamId: "14",
      tableOrBreakoutRoom: "14",
      requestTime: "2026-04-30T15:10:30",
      explanation:
        "The GitHub Actions workflow is failing on the Jacoco test coverage step, but it passes locally.",
      solved: true,
    },
  ],
};

export { helpRequestFixtures };
