package com.voyagereserv.domain;

import static com.voyagereserv.domain.ActiviteTestSamples.*;
import static com.voyagereserv.domain.CommentaireTestSamples.*;
import static com.voyagereserv.domain.HotelTestSamples.*;
import static com.voyagereserv.domain.NotificationTestSamples.*;
import static com.voyagereserv.domain.PaiementTestSamples.*;
import static com.voyagereserv.domain.ReservationTestSamples.*;
import static com.voyagereserv.domain.VolTestSamples.*;
import static com.voyagereserv.domain.VoyageurTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.voyagereserv.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ReservationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reservation.class);
        Reservation reservation1 = getReservationSample1();
        Reservation reservation2 = new Reservation();
        assertThat(reservation1).isNotEqualTo(reservation2);

        reservation2.setId(reservation1.getId());
        assertThat(reservation1).isEqualTo(reservation2);

        reservation2 = getReservationSample2();
        assertThat(reservation1).isNotEqualTo(reservation2);
    }

    @Test
    void volsTest() throws Exception {
        Reservation reservation = getReservationRandomSampleGenerator();
        Vol volBack = getVolRandomSampleGenerator();

        reservation.addVols(volBack);
        assertThat(reservation.getVols()).containsOnly(volBack);

        reservation.removeVols(volBack);
        assertThat(reservation.getVols()).doesNotContain(volBack);

        reservation.vols(new HashSet<>(Set.of(volBack)));
        assertThat(reservation.getVols()).containsOnly(volBack);

        reservation.setVols(new HashSet<>());
        assertThat(reservation.getVols()).doesNotContain(volBack);
    }

    @Test
    void hotelsTest() throws Exception {
        Reservation reservation = getReservationRandomSampleGenerator();
        Hotel hotelBack = getHotelRandomSampleGenerator();

        reservation.addHotels(hotelBack);
        assertThat(reservation.getHotels()).containsOnly(hotelBack);

        reservation.removeHotels(hotelBack);
        assertThat(reservation.getHotels()).doesNotContain(hotelBack);

        reservation.hotels(new HashSet<>(Set.of(hotelBack)));
        assertThat(reservation.getHotels()).containsOnly(hotelBack);

        reservation.setHotels(new HashSet<>());
        assertThat(reservation.getHotels()).doesNotContain(hotelBack);
    }

    @Test
    void activitesTest() throws Exception {
        Reservation reservation = getReservationRandomSampleGenerator();
        Activite activiteBack = getActiviteRandomSampleGenerator();

        reservation.addActivites(activiteBack);
        assertThat(reservation.getActivites()).containsOnly(activiteBack);

        reservation.removeActivites(activiteBack);
        assertThat(reservation.getActivites()).doesNotContain(activiteBack);

        reservation.activites(new HashSet<>(Set.of(activiteBack)));
        assertThat(reservation.getActivites()).containsOnly(activiteBack);

        reservation.setActivites(new HashSet<>());
        assertThat(reservation.getActivites()).doesNotContain(activiteBack);
    }

    @Test
    void voyageurTest() throws Exception {
        Reservation reservation = getReservationRandomSampleGenerator();
        Voyageur voyageurBack = getVoyageurRandomSampleGenerator();

        reservation.setVoyageur(voyageurBack);
        assertThat(reservation.getVoyageur()).isEqualTo(voyageurBack);

        reservation.voyageur(null);
        assertThat(reservation.getVoyageur()).isNull();
    }

    @Test
    void paiementsTest() throws Exception {
        Reservation reservation = getReservationRandomSampleGenerator();
        Paiement paiementBack = getPaiementRandomSampleGenerator();

        reservation.addPaiements(paiementBack);
        assertThat(reservation.getPaiements()).containsOnly(paiementBack);
        assertThat(paiementBack.getReservation()).isEqualTo(reservation);

        reservation.removePaiements(paiementBack);
        assertThat(reservation.getPaiements()).doesNotContain(paiementBack);
        assertThat(paiementBack.getReservation()).isNull();

        reservation.paiements(new HashSet<>(Set.of(paiementBack)));
        assertThat(reservation.getPaiements()).containsOnly(paiementBack);
        assertThat(paiementBack.getReservation()).isEqualTo(reservation);

        reservation.setPaiements(new HashSet<>());
        assertThat(reservation.getPaiements()).doesNotContain(paiementBack);
        assertThat(paiementBack.getReservation()).isNull();
    }

    @Test
    void notificationsTest() throws Exception {
        Reservation reservation = getReservationRandomSampleGenerator();
        Notification notificationBack = getNotificationRandomSampleGenerator();

        reservation.addNotifications(notificationBack);
        assertThat(reservation.getNotifications()).containsOnly(notificationBack);
        assertThat(notificationBack.getReservation()).isEqualTo(reservation);

        reservation.removeNotifications(notificationBack);
        assertThat(reservation.getNotifications()).doesNotContain(notificationBack);
        assertThat(notificationBack.getReservation()).isNull();

        reservation.notifications(new HashSet<>(Set.of(notificationBack)));
        assertThat(reservation.getNotifications()).containsOnly(notificationBack);
        assertThat(notificationBack.getReservation()).isEqualTo(reservation);

        reservation.setNotifications(new HashSet<>());
        assertThat(reservation.getNotifications()).doesNotContain(notificationBack);
        assertThat(notificationBack.getReservation()).isNull();
    }

    @Test
    void commentairesTest() throws Exception {
        Reservation reservation = getReservationRandomSampleGenerator();
        Commentaire commentaireBack = getCommentaireRandomSampleGenerator();

        reservation.addCommentaires(commentaireBack);
        assertThat(reservation.getCommentaires()).containsOnly(commentaireBack);
        assertThat(commentaireBack.getReservation()).isEqualTo(reservation);

        reservation.removeCommentaires(commentaireBack);
        assertThat(reservation.getCommentaires()).doesNotContain(commentaireBack);
        assertThat(commentaireBack.getReservation()).isNull();

        reservation.commentaires(new HashSet<>(Set.of(commentaireBack)));
        assertThat(reservation.getCommentaires()).containsOnly(commentaireBack);
        assertThat(commentaireBack.getReservation()).isEqualTo(reservation);

        reservation.setCommentaires(new HashSet<>());
        assertThat(reservation.getCommentaires()).doesNotContain(commentaireBack);
        assertThat(commentaireBack.getReservation()).isNull();
    }
}
