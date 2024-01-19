package com.voyagereserv.domain;

import static com.voyagereserv.domain.ReservationTestSamples.*;
import static com.voyagereserv.domain.VoyageurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.voyagereserv.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class VoyageurTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Voyageur.class);
        Voyageur voyageur1 = getVoyageurSample1();
        Voyageur voyageur2 = new Voyageur();
        assertThat(voyageur1).isNotEqualTo(voyageur2);

        voyageur2.setId(voyageur1.getId());
        assertThat(voyageur1).isEqualTo(voyageur2);

        voyageur2 = getVoyageurSample2();
        assertThat(voyageur1).isNotEqualTo(voyageur2);
    }

    @Test
    void reservationsTest() throws Exception {
        Voyageur voyageur = getVoyageurRandomSampleGenerator();
        Reservation reservationBack = getReservationRandomSampleGenerator();

        voyageur.addReservations(reservationBack);
        assertThat(voyageur.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getVoyageur()).isEqualTo(voyageur);

        voyageur.removeReservations(reservationBack);
        assertThat(voyageur.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getVoyageur()).isNull();

        voyageur.reservations(new HashSet<>(Set.of(reservationBack)));
        assertThat(voyageur.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getVoyageur()).isEqualTo(voyageur);

        voyageur.setReservations(new HashSet<>());
        assertThat(voyageur.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getVoyageur()).isNull();
    }
}
