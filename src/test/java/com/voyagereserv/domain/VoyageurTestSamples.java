package com.voyagereserv.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class VoyageurTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Voyageur getVoyageurSample1() {
        return new Voyageur().id(1L).nom("nom1").email("email1").motDePasse("motDePasse1");
    }

    public static Voyageur getVoyageurSample2() {
        return new Voyageur().id(2L).nom("nom2").email("email2").motDePasse("motDePasse2");
    }

    public static Voyageur getVoyageurRandomSampleGenerator() {
        return new Voyageur()
            .id(longCount.incrementAndGet())
            .nom(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .motDePasse(UUID.randomUUID().toString());
    }
}
