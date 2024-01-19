package com.voyagereserv.domain;

import static com.voyagereserv.domain.HotelTestSamples.*;
import static com.voyagereserv.domain.ReservationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.voyagereserv.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class HotelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Hotel.class);
        Hotel hotel1 = getHotelSample1();
        Hotel hotel2 = new Hotel();
        assertThat(hotel1).isNotEqualTo(hotel2);

        hotel2.setId(hotel1.getId());
        assertThat(hotel1).isEqualTo(hotel2);

        hotel2 = getHotelSample2();
        assertThat(hotel1).isNotEqualTo(hotel2);
    }

    @Test
    void reservationsTest() throws Exception {
        Hotel hotel = getHotelRandomSampleGenerator();
        Reservation reservationBack = getReservationRandomSampleGenerator();

        hotel.addReservations(reservationBack);
        assertThat(hotel.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getHotels()).containsOnly(hotel);

        hotel.removeReservations(reservationBack);
        assertThat(hotel.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getHotels()).doesNotContain(hotel);

        hotel.reservations(new HashSet<>(Set.of(reservationBack)));
        assertThat(hotel.getReservations()).containsOnly(reservationBack);
        assertThat(reservationBack.getHotels()).containsOnly(hotel);

        hotel.setReservations(new HashSet<>());
        assertThat(hotel.getReservations()).doesNotContain(reservationBack);
        assertThat(reservationBack.getHotels()).doesNotContain(hotel);
    }
}
