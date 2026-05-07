import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

import App from "../App";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockCurrentUser = vi.hoisted(() => ({
  value: undefined,
}));

const mockPage = vi.hoisted(() => (text) => {
  function MockPage() {
    return React.createElement("div", null, text);
  }
  MockPage.displayName = `MockPage(${text})`;
  return MockPage;
});

vi.mock("main/utils/useCurrentUser", () => ({
  useCurrentUser: () => mockCurrentUser.value,
  hasRole: (currentUser, role) =>
    Boolean(currentUser?.root?.rolesList?.includes(role)),
}));

vi.mock("main/pages/HomePage", () => ({ default: mockPage("Home Page") }));
vi.mock("main/pages/ProfilePage", () => ({
  default: mockPage("Profile Page"),
}));
vi.mock("main/pages/AdminUsersPage", () => ({
  default: mockPage("Admin Users Page"),
}));
vi.mock("main/pages/UCSBDates/UCSBDatesIndexPage", () => ({
  default: mockPage("UCSB Dates Index Page"),
}));
vi.mock("main/pages/UCSBDates/UCSBDatesCreatePage", () => ({
  default: mockPage("UCSB Dates Create Page"),
}));
vi.mock("main/pages/UCSBDates/UCSBDatesEditPage", () => ({
  default: mockPage("UCSB Dates Edit Page"),
}));
vi.mock("main/pages/Restaurants/RestaurantIndexPage", () => ({
  default: mockPage("Restaurant Index Page"),
}));
vi.mock("main/pages/Restaurants/RestaurantCreatePage", () => ({
  default: mockPage("Restaurant Create Page"),
}));
vi.mock("main/pages/Restaurants/RestaurantEditPage", () => ({
  default: mockPage("Restaurant Edit Page"),
}));
vi.mock("main/pages/Placeholder/PlaceholderIndexPage", () => ({
  default: mockPage("Placeholder Index Page"),
}));
vi.mock("main/pages/Placeholder/PlaceholderCreatePage", () => ({
  default: mockPage("Placeholder Create Page"),
}));
vi.mock("main/pages/Placeholder/PlaceholderEditPage", () => ({
  default: mockPage("Placeholder Edit Page"),
}));
vi.mock("main/pages/MenuItemReview/MenuItemReviewIndexPage", () => ({
  default: mockPage("Menu Item Review Index Page"),
}));
vi.mock("main/pages/MenuItemReview/MenuItemReviewCreatePage", () => ({
  default: mockPage("Menu Item Review Create Page"),
}));
vi.mock("main/pages/MenuItemReview/MenuItemReviewEditPage", () => ({
  default: mockPage("Menu Item Review Edit Page"),
}));
vi.mock(
  "main/pages/RecommendationRequest/RecommendationRequestIndexPage",
  () => ({
    default: mockPage("Recommendation Request Index Page"),
  }),
);
vi.mock(
  "main/pages/RecommendationRequest/RecommendationRequestCreatePage",
  () => ({
    default: mockPage("Recommendation Request Create Page"),
  }),
);
vi.mock(
  "main/pages/RecommendationRequest/RecommendationRequestEditPage",
  () => ({
    default: mockPage("Recommendation Request Edit Page"),
  }),
);

describe("App tests", () => {
  const h = React.createElement;

  const renderAtPath = (path, currentUser) => {
    mockCurrentUser.value = currentUser;
    render(h(MemoryRouter, { initialEntries: [path] }, h(App)));
  };

  test.each([
    ["/", currentUserFixtures.notLoggedIn, "Home Page"],
    ["/profile", currentUserFixtures.notLoggedIn, "Profile Page"],
    ["/ucsbdates", currentUserFixtures.userOnly, "UCSB Dates Index Page"],
    ["/restaurants", currentUserFixtures.userOnly, "Restaurant Index Page"],
    ["/placeholder", currentUserFixtures.userOnly, "Placeholder Index Page"],
    [
      "/menuitemreview",
      currentUserFixtures.userOnly,
      "Menu Item Review Index Page",
    ],
    [
      "/recommendationrequest",
      currentUserFixtures.userOnly,
      "Recommendation Request Index Page",
    ],
    ["/admin/users", currentUserFixtures.adminUser, "Admin Users Page"],
    [
      "/ucsbdates/create",
      currentUserFixtures.adminUser,
      "UCSB Dates Create Page",
    ],
    [
      "/ucsbdates/edit/1",
      currentUserFixtures.adminUser,
      "UCSB Dates Edit Page",
    ],
    [
      "/restaurants/create",
      currentUserFixtures.adminUser,
      "Restaurant Create Page",
    ],
    [
      "/restaurants/edit/1",
      currentUserFixtures.adminUser,
      "Restaurant Edit Page",
    ],
    [
      "/placeholder/create",
      currentUserFixtures.adminUser,
      "Placeholder Create Page",
    ],
    [
      "/placeholder/edit/1",
      currentUserFixtures.adminUser,
      "Placeholder Edit Page",
    ],
    [
      "/menuitemreview/create",
      currentUserFixtures.adminUser,
      "Menu Item Review Create Page",
    ],
    [
      "/menuitemreview/edit/1",
      currentUserFixtures.adminUser,
      "Menu Item Review Edit Page",
    ],
    [
      "/recommendationrequest/create",
      currentUserFixtures.adminUser,
      "Recommendation Request Create Page",
    ],
    [
      "/recommendationrequest/edit/1",
      currentUserFixtures.adminUser,
      "Recommendation Request Edit Page",
    ],
  ])(
    "renders %s for allowed users",
    async (path, currentUser, expectedText) => {
      renderAtPath(path, currentUser);

      expect(await screen.findByText(expectedText)).toBeInTheDocument();
    },
  );

  test("does not render protected routes for logged out users", () => {
    renderAtPath("/recommendationrequest", currentUserFixtures.notLoggedIn);

    expect(
      screen.queryByText("Recommendation Request Index Page"),
    ).not.toBeInTheDocument();
  });
});
