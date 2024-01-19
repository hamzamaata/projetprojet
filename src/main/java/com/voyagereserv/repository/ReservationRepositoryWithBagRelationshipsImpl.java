package com.voyagereserv.repository;

import com.voyagereserv.domain.Reservation;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ReservationRepositoryWithBagRelationshipsImpl implements ReservationRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Reservation> fetchBagRelationships(Optional<Reservation> reservation) {
        return reservation.map(this::fetchVols).map(this::fetchHotels).map(this::fetchActivites);
    }

    @Override
    public Page<Reservation> fetchBagRelationships(Page<Reservation> reservations) {
        return new PageImpl<>(
            fetchBagRelationships(reservations.getContent()),
            reservations.getPageable(),
            reservations.getTotalElements()
        );
    }

    @Override
    public List<Reservation> fetchBagRelationships(List<Reservation> reservations) {
        return Optional
            .of(reservations)
            .map(this::fetchVols)
            .map(this::fetchHotels)
            .map(this::fetchActivites)
            .orElse(Collections.emptyList());
    }

    Reservation fetchVols(Reservation result) {
        return entityManager
            .createQuery(
                "select reservation from Reservation reservation left join fetch reservation.vols where reservation.id = :id",
                Reservation.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Reservation> fetchVols(List<Reservation> reservations) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, reservations.size()).forEach(index -> order.put(reservations.get(index).getId(), index));
        List<Reservation> result = entityManager
            .createQuery(
                "select reservation from Reservation reservation left join fetch reservation.vols where reservation in :reservations",
                Reservation.class
            )
            .setParameter("reservations", reservations)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Reservation fetchHotels(Reservation result) {
        return entityManager
            .createQuery(
                "select reservation from Reservation reservation left join fetch reservation.hotels where reservation.id = :id",
                Reservation.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Reservation> fetchHotels(List<Reservation> reservations) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, reservations.size()).forEach(index -> order.put(reservations.get(index).getId(), index));
        List<Reservation> result = entityManager
            .createQuery(
                "select reservation from Reservation reservation left join fetch reservation.hotels where reservation in :reservations",
                Reservation.class
            )
            .setParameter("reservations", reservations)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Reservation fetchActivites(Reservation result) {
        return entityManager
            .createQuery(
                "select reservation from Reservation reservation left join fetch reservation.activites where reservation.id = :id",
                Reservation.class
            )
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Reservation> fetchActivites(List<Reservation> reservations) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, reservations.size()).forEach(index -> order.put(reservations.get(index).getId(), index));
        List<Reservation> result = entityManager
            .createQuery(
                "select reservation from Reservation reservation left join fetch reservation.activites where reservation in :reservations",
                Reservation.class
            )
            .setParameter("reservations", reservations)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
