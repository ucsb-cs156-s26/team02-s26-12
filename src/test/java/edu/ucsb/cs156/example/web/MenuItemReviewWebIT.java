package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {

  @Autowired MenuItemReviewRepository menuItemReviewRepository;

  @Test
  public void admin_user_can_delete_menu_item_review_from_index() throws Exception {

    LocalDateTime reviewedAt = LocalDateTime.parse("2022-01-03T12:00:00");

    MenuItemReview review =
        MenuItemReview.builder()
            .itemId(101L)
            .reviewerEmail("webit@ucsb.edu")
            .stars(5)
            .dateReviewed(reviewedAt)
            .comments("Seeded for MenuItemReview WebIT delete")
            .build();

    menuItemReviewRepository.save(review);
    setupUser(true);

    page.getByText("MenuItemReview").click();

    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments"))
        .hasText("Seeded for MenuItemReview WebIT delete");

    page.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("MenuItemReviewTable-cell-row-0-col-comments")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_menu_item_review() throws Exception {
    setupUser(false);

    page.getByText("MenuItemReview").click();

    assertThat(page.getByText("Create Menu Item Review")).not().isVisible();
  }

  @Test
  public void admin_user_can_see_create_menu_item_review_button() throws Exception {
    setupUser(true);

    page.getByText("MenuItemReview").click();

    assertThat(page.getByText("Create Menu Item Review")).isVisible();
  }
}
