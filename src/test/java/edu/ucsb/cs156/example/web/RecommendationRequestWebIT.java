package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
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
public class RecommendationRequestWebIT extends WebTestCase {

  @Autowired RecommendationRequestRepository recommendationRequestRepository;

  @Test
  public void admin_user_can_delete_recommendation_request_from_index() throws Exception {

    LocalDateTime dateRequested = LocalDateTime.parse("2026-05-01T09:00:00");
    LocalDateTime dateNeeded = LocalDateTime.parse("2026-06-01T17:00:00");

    RecommendationRequest recommendationRequest =
        RecommendationRequest.builder()
            .requesterEmail("student@ucsb.edu")
            .professorEmail("professor@ucsb.edu")
            .explanation("Seeded for RecommendationRequest WebIT delete")
            .dateRequested(dateRequested)
            .dateNeeded(dateNeeded)
            .done(false)
            .build();

    recommendationRequestRepository.save(recommendationRequest);
    setupUser(true);

    page.getByText("RecommendationRequest").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
        .hasText("Seeded for RecommendationRequest WebIT delete");

    page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_recommendation_request() throws Exception {
    setupUser(false);

    page.getByText("RecommendationRequest").click();

    assertThat(page.getByText("Create RecommendationRequest")).not().isVisible();
  }

  @Test
  public void admin_user_can_see_create_recommendation_request_button() throws Exception {
    setupUser(true);

    page.getByText("RecommendationRequest").click();

    assertThat(page.getByText("Create RecommendationRequest")).isVisible();
  }
}
