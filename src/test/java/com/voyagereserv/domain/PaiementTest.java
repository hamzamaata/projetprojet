package com.voyagereserv.domain;

import static com.voyagereserv.domain.PaiementTestSamples.*;
import static com.voyagereserv.domain.ReservationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.voyagereserv.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaiementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Paiement.class);
        Paiement paiement1 = getPaiementSample1();
        Paiement paiement2 = new Paiement();
        assertThat(paiement1).isNotEqualTo(paiement2);

        paiement2.setId(paiement1.getId());
        assertThat(paiement1).isEqualTo(paiement2);

        paiement2 = getPaiementSample2();
        assertThat(paiement1).isNotEqualTo(paiement2);
    }

    @Test
    void reservationTest() throws Exception {
        Paiement paiement = getPaiementRandomSampleGenerator();
        Reservation reservationBack = getReservationRandomSampleGenerator();

        paiement.setReservation(reservationBack);
        assertThat(paiement.getReservation()).isEqualTo(reservationBack);

        paiement.reservation(null);
        assertThat(paiement.getReservation()).isNull();
    }
}
