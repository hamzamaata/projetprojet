package com.voyagereserv.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CommentaireTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Commentaire getCommentaireSample1() {
        return new Commentaire().id(1L).texte("texte1").note(1);
    }

    public static Commentaire getCommentaireSample2() {
        return new Commentaire().id(2L).texte("texte2").note(2);
    }

    public static Commentaire getCommentaireRandomSampleGenerator() {
        return new Commentaire().id(longCount.incrementAndGet()).texte(UUID.randomUUID().toString()).note(intCount.incrementAndGet());
    }
}
