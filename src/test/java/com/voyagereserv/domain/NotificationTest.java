package com.voyagereserv.domain;

import static com.voyagereserv.domain.NotificationTestSamples.*;
import static com.voyagereserv.domain.ReservationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.voyagereserv.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NotificationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Notification.class);
        Notification notification1 = getNotificationSample1();
        Notification notification2 = new Notification();
        assertThat(notification1).isNotEqualTo(notification2);

        notification2.setId(notification1.getId());
        assertThat(notification1).isEqualTo(notification2);

        notification2 = getNotificationSample2();
        assertThat(notification1).isNotEqualTo(notification2);
    }

    @Test
    void reservationTest() throws Exception {
        Notification notification = getNotificationRandomSampleGenerator();
        Reservation reservationBack = getReservationRandomSampleGenerator();

        notification.setReservation(reservationBack);
        assertThat(notification.getReservation()).isEqualTo(reservationBack);

        notification.reservation(null);
        assertThat(notification.getReservation()).isNull();
    }
}
