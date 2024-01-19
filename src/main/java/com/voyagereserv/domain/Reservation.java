package com.voyagereserv.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.voyagereserv.domain.enumeration.ServiceType;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Reservation.
 */
@Entity
@Table(name = "reservation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_service")
    private ServiceType typeService;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_reservation__vols",
        joinColumns = @JoinColumn(name = "reservation_id"),
        inverseJoinColumns = @JoinColumn(name = "vols_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reservations" }, allowSetters = true)
    private Set<Vol> vols = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_reservation__hotels",
        joinColumns = @JoinColumn(name = "reservation_id"),
        inverseJoinColumns = @JoinColumn(name = "hotels_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reservations" }, allowSetters = true)
    private Set<Hotel> hotels = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_reservation__activites",
        joinColumns = @JoinColumn(name = "reservation_id"),
        inverseJoinColumns = @JoinColumn(name = "activites_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reservations" }, allowSetters = true)
    private Set<Activite> activites = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "reservations" }, allowSetters = true)
    private Voyageur voyageur;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "reservation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reservation" }, allowSetters = true)
    private Set<Paiement> paiements = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "reservation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reservation" }, allowSetters = true)
    private Set<Notification> notifications = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "reservation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "reservation" }, allowSetters = true)
    private Set<Commentaire> commentaires = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Reservation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateDebut() {
        return this.dateDebut;
    }

    public Reservation dateDebut(LocalDate dateDebut) {
        this.setDateDebut(dateDebut);
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return this.dateFin;
    }

    public Reservation dateFin(LocalDate dateFin) {
        this.setDateFin(dateFin);
        return this;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public ServiceType getTypeService() {
        return this.typeService;
    }

    public Reservation typeService(ServiceType typeService) {
        this.setTypeService(typeService);
        return this;
    }

    public void setTypeService(ServiceType typeService) {
        this.typeService = typeService;
    }

    public Set<Vol> getVols() {
        return this.vols;
    }

    public void setVols(Set<Vol> vols) {
        this.vols = vols;
    }

    public Reservation vols(Set<Vol> vols) {
        this.setVols(vols);
        return this;
    }

    public Reservation addVols(Vol vol) {
        this.vols.add(vol);
        return this;
    }

    public Reservation removeVols(Vol vol) {
        this.vols.remove(vol);
        return this;
    }

    public Set<Hotel> getHotels() {
        return this.hotels;
    }

    public void setHotels(Set<Hotel> hotels) {
        this.hotels = hotels;
    }

    public Reservation hotels(Set<Hotel> hotels) {
        this.setHotels(hotels);
        return this;
    }

    public Reservation addHotels(Hotel hotel) {
        this.hotels.add(hotel);
        return this;
    }

    public Reservation removeHotels(Hotel hotel) {
        this.hotels.remove(hotel);
        return this;
    }

    public Set<Activite> getActivites() {
        return this.activites;
    }

    public void setActivites(Set<Activite> activites) {
        this.activites = activites;
    }

    public Reservation activites(Set<Activite> activites) {
        this.setActivites(activites);
        return this;
    }

    public Reservation addActivites(Activite activite) {
        this.activites.add(activite);
        return this;
    }

    public Reservation removeActivites(Activite activite) {
        this.activites.remove(activite);
        return this;
    }

    public Voyageur getVoyageur() {
        return this.voyageur;
    }

    public void setVoyageur(Voyageur voyageur) {
        this.voyageur = voyageur;
    }

    public Reservation voyageur(Voyageur voyageur) {
        this.setVoyageur(voyageur);
        return this;
    }

    public Set<Paiement> getPaiements() {
        return this.paiements;
    }

    public void setPaiements(Set<Paiement> paiements) {
        if (this.paiements != null) {
            this.paiements.forEach(i -> i.setReservation(null));
        }
        if (paiements != null) {
            paiements.forEach(i -> i.setReservation(this));
        }
        this.paiements = paiements;
    }

    public Reservation paiements(Set<Paiement> paiements) {
        this.setPaiements(paiements);
        return this;
    }

    public Reservation addPaiements(Paiement paiement) {
        this.paiements.add(paiement);
        paiement.setReservation(this);
        return this;
    }

    public Reservation removePaiements(Paiement paiement) {
        this.paiements.remove(paiement);
        paiement.setReservation(null);
        return this;
    }

    public Set<Notification> getNotifications() {
        return this.notifications;
    }

    public void setNotifications(Set<Notification> notifications) {
        if (this.notifications != null) {
            this.notifications.forEach(i -> i.setReservation(null));
        }
        if (notifications != null) {
            notifications.forEach(i -> i.setReservation(this));
        }
        this.notifications = notifications;
    }

    public Reservation notifications(Set<Notification> notifications) {
        this.setNotifications(notifications);
        return this;
    }

    public Reservation addNotifications(Notification notification) {
        this.notifications.add(notification);
        notification.setReservation(this);
        return this;
    }

    public Reservation removeNotifications(Notification notification) {
        this.notifications.remove(notification);
        notification.setReservation(null);
        return this;
    }

    public Set<Commentaire> getCommentaires() {
        return this.commentaires;
    }

    public void setCommentaires(Set<Commentaire> commentaires) {
        if (this.commentaires != null) {
            this.commentaires.forEach(i -> i.setReservation(null));
        }
        if (commentaires != null) {
            commentaires.forEach(i -> i.setReservation(this));
        }
        this.commentaires = commentaires;
    }

    public Reservation commentaires(Set<Commentaire> commentaires) {
        this.setCommentaires(commentaires);
        return this;
    }

    public Reservation addCommentaires(Commentaire commentaire) {
        this.commentaires.add(commentaire);
        commentaire.setReservation(this);
        return this;
    }

    public Reservation removeCommentaires(Commentaire commentaire) {
        this.commentaires.remove(commentaire);
        commentaire.setReservation(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reservation)) {
            return false;
        }
        return getId() != null && getId().equals(((Reservation) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reservation{" +
            "id=" + getId() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            ", typeService='" + getTypeService() + "'" +
            "}";
    }
}
