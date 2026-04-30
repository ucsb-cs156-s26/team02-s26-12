const menuItemReviewFixtures = {
  threeReviews: [
    {
      id: 1,
      itemId: 101,
      reviewerEmail: "cgaucho@ucsb.edu",
      stars: 5,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "Best pizza at Carrillo",
    },
    {
      id: 2,
      itemId: 102,
      reviewerEmail: "ldelplaya@ucsb.edu",
      stars: 3,
      dateReviewed: "2022-04-03T12:00:00",
      comments: "Average tacos",
    },
    {
      id: 3,
      itemId: 103,
      reviewerEmail: "pconrad@ucsb.edu",
      stars: 2,
      dateReviewed: "2022-07-04T12:00:00",
      comments: "Too salty",
    },
  ],
  oneReview: {
    id: 1,
    itemId: 104,
    reviewerEmail: "student@ucsb.edu",
    stars: 4,
    dateReviewed: "2022-05-05T12:00:00",
    comments: "Pretty good",
  },
};

export { menuItemReviewFixtures };
