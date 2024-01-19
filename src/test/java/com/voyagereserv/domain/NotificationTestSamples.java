package com.voyagereserv.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class NotificationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Notification getNotificationSample1() {
        return new Notification().id(1L).contenu("contenu1").destinataire(1L);
    }

    public static Notification getNotificationSample2() {
        return new Notification().id(2L).contenu("contenu2").destinataire(2L);
    }

    public static Notification getNotificationRandomSampleGenerator() {
        return new Notification()
            .id(longCount.incrementAndGet())
            .contenu(UUID.randomUUID().toString())
            .destinataire(longCount.incrementAndGet());
    }
}
