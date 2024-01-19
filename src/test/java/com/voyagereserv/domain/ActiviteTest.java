package com.voyagereserv.domain;

import static com.voyagereserv.domain.ActiviteTestSamples.*;
import static com.voyagereserv.domain.ReservationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.voyagereserv.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ActiviteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Activite.class);
        Activite activite1 = getActiviteSample1();
        Activite activite2 = new Activite();
        assertThat(activite1).isNotEqualTo(activite2);

        activite2.setId(activite1.getId());
        assertThat(activite1).isEqualTo(activite2);

        activite2 = getActiviteSample2();
        assertThat(activite1).isNotEqualTo(activite2);
    }

    @Test
    void reservationsTest() throws Exception {
        Activite activite = getActiviteRandomSampleGenerator();
        Reservation reservationBack = getReservationRandomSampleGenerator();

        activite.addReservations(reservationBack);
        assertThat(activite.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getActivites()).containsOnly(activite);

        activite.removeReservations(reservationBack);
        assertThat(activite.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getActivites()).doesNotContain(activite);

        activite.reservations(new HashSet<>(Set.of(reservationBack)));
        assertThat(activite.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getActivites()).containsOnly(activite);

        activite.setReservations(new HashSet<>());
        assertThat(activite.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getActivites()).doesNotContain(activite);
    }
}
