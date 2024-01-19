package com.voyagereserv.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vol.
 */
@Entity
@Table(name = "vol")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vol implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "compagnie")
    private String compagnie;

    @Column(name = "horaire")
    private String horaire;

    @Column(name = "tarif")
    private Double tarif;

    @Column(name = "sieges_disponibles")
    private Integer siegesDisponibles;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "vols")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "vols", "hotels", "activites", "voyageur", "paiements", "notifications", "commentaires" },
        allowSetters = true
    )
    private Set<Reservation> reservations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Vol id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompagnie() {
        return this.compagnie;
    }

    public Vol compagnie(String compagnie) {
        this.setCompagnie(compagnie);
        return this;
    }

    public void setCompagnie(String compagnie) {
        this.compagnie = compagnie;
    }

    public String getHoraire() {
        return this.horaire;
    }

    public Vol horaire(String horaire) {
        this.setHoraire(horaire);
        return this;
    }

    public void setHoraire(String horaire) {
        this.horaire = horaire;
    }

    public Double getTarif() {
        return this.tarif;
    }

    public Vol tarif(Double tarif) {
        this.setTarif(tarif);
        return this;
    }

    public void setTarif(Double tarif) {
        this.tarif = tarif;
    }

    public Integer getSiegesDisponibles() {
        return this.siegesDisponibles;
    }

    public Vol siegesDisponibles(Integer siegesDisponibles) {
        this.setSiegesDisponibles(siegesDisponibles);
        return this;
    }

    public void setSiegesDisponibles(Integer siegesDisponibles) {
        this.siegesDisponibles = siegesDisponibles;
    }

    public Set<Reservation> getReservations() {
        return this.reservations;
    }

    public void setReservations(Set<Reservation> reservations) {
        if (this.reservations != null) {
            this.reservations.forEach(i -> i.removeVols(this));
        }
        if (reservations != null) {
            reservations.forEach(i -> i.addVols(this));
        }
        this.reservations = reservations;
    }

    public Vol reservations(Set<Reservation> reservations) {
        this.setReservations(reservations);
        return this;
    }

    public Vol addReservations(Reservation reservation) {
        this.reservations.add(reservation);
        reservation.getVols().add(this);
        return this;
    }

    public Vol removeReservations(Reservation reservation) {
        this.reservations.remove(reservation);
        reservation.getVols().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vol)) {
            return false;
        }
        return getId() != null && getId().equals(((Vol) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vol{" +
            "id=" + getId() +
            ", compagnie='" + getCompagnie() + "'" +
            ", horaire='" + getHoraire() + "'" +
            ", tarif=" + getTarif() +
            ", siegesDisponibles=" + getSiegesDisponibles() +
            "}";
    }
}
