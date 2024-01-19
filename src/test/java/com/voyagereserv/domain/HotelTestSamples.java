package com.voyagereserv.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class HotelTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Hotel getHotelSample1() {
        return new Hotel().id(1L).nom("nom1").localisation("localisation1");
    }

    public static Hotel getHotelSample2() {
        return new Hotel().id(2L).nom("nom2").localisation("localisation2");
    }

    public static Hotel getHotelRandomSampleGenerator() {
        return new Hotel().id(longCount.incrementAndGet()).nom(UUID.randomUUID().toString()).localisation(UUID.randomUUID().toString());
    }
}
