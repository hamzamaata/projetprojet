package com.voyagereserv.domain;

import static com.voyagereserv.domain.CommentaireTestSamples.*;
import static com.voyagereserv.domain.ReservationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.voyagereserv.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CommentaireTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Commentaire.class);
        Commentaire commentaire1 = getCommentaireSample1();
        Commentaire commentaire2 = new Commentaire();
        assertThat(commentaire1).isNotEqualTo(commentaire2);

        commentaire2.setId(commentaire1.getId());
        assertThat(commentaire1).isEqualTo(commentaire2);

        commentaire2 = getCommentaireSample2();
        assertThat(commentaire1).isNotEqualTo(commentaire2);
    }

    @Test
    void reservationTest() throws Exception {
        Commentaire commentaire = getCommentaireRandomSampleGenerator();
        Reservation reservationBack = getReservationRandomSampleGenerator();

        commentaire.setReservation(reservationBack);
        assertThat(commentaire.getReservation()).isEqualTo(reservationBack);

        commentaire.reservation(null);
        assertThat(commentaire.getReservation()).isNull();
    }
}
