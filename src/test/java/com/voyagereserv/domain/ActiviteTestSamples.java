package com.voyagereserv.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ActiviteTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Activite getActiviteSample1() {
        return new Activite().id(1L).nom("nom1").description("description1").lieu("lieu1");
    }

    public static Activite getActiviteSample2() {
        return new Activite().id(2L).nom("nom2").description("description2").lieu("lieu2");
    }

    public static Activite getActiviteRandomSampleGenerator() {
        return new Activite()
            .id(longCount.incrementAndGet())
            .nom(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .lieu(UUID.randomUUID().toString());
    }
}
