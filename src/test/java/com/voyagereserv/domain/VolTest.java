package com.voyagereserv.domain;

import static com.voyagereserv.domain.ReservationTestSamples.*;
import static com.voyagereserv.domain.VolTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.voyagereserv.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class VolTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Vol.class);
        Vol vol1 = getVolSample1();
        Vol vol2 = new Vol();
        assertThat(vol1).isNotEqualTo(vol2);

        vol2.setId(vol1.getId());
        assertThat(vol1).isEqualTo(vol2);

        vol2 = getVolSample2();
        assertThat(vol1).isNotEqualTo(vol2);
    }

    @Test
    void reservationsTest() throws Exception {
        Vol vol = getVolRandomSampleGenerator();
        Reservation reservationBack = getReservationRandomSampleGenerator();

        vol.addReservations(reservationBack);
        assertThat(vol.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getVols()).containsOnly(vol);

        vol.removeReservations(reservationBack);
        assertThat(vol.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getVols()).doesNotContain(vol);

        vol.reservations(new HashSet<>(Set.of(reservationBack)));
        assertThat(vol.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getVols()).containsOnly(vol);

        vol.setReservations(new HashSet<>());
        assertThat(vol.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getVols()).doesNotContain(vol);
    }
}
