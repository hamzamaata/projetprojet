package com.voyagereserv.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class VolTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Vol getVolSample1() {
        return new Vol().id(1L).compagnie("compagnie1").horaire("horaire1").siegesDisponibles(1);
    }

    public static Vol getVolSample2() {
        return new Vol().id(2L).compagnie("compagnie2").horaire("horaire2").siegesDisponibles(2);
    }

    public static Vol getVolRandomSampleGenerator() {
        return new Vol()
            .id(longCount.incrementAndGet())
            .compagnie(UUID.randomUUID().toString())
            .horaire(UUID.randomUUID().toString())
            .siegesDisponibles(intCount.incrementAndGet());
    }
}
