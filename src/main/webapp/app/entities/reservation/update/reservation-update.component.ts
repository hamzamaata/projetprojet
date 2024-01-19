import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVol } from 'app/entities/vol/vol.model';
import { VolService } from 'app/entities/vol/service/vol.service';
import { IHotel } from 'app/entities/hotel/hotel.model';
import { HotelService } from 'app/entities/hotel/service/hotel.service';
import { IActivite } from 'app/entities/activite/activite.model';
import { ActiviteService } from 'app/entities/activite/service/activite.service';
import { IVoyageur } from 'app/entities/voyageur/voyageur.model';
import { VoyageurService } from 'app/entities/voyageur/service/voyageur.service';
import { ServiceType } from 'app/entities/enumerations/service-type.model';
import { ReservationService } from '../service/reservation.service';
import { IReservation } from '../reservation.model';
import { ReservationFormService, ReservationFormGroup } from './reservation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-reservation-update',
  templateUrl: './reservation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ReservationUpdateComponent implements OnInit {
  isSaving = false;
  reservation: IReservation | null = null;
  serviceTypeValues = Object.keys(ServiceType);

  volsSharedCollection: IVol[] = [];
  hotelsSharedCollection: IHotel[] = [];
  activitesSharedCollection: IActivite[] = [];
  voyageursSharedCollection: IVoyageur[] = [];

  editForm: ReservationFormGroup = this.reservationFormService.createReservationFormGroup();

  constructor(
    protected reservationService: ReservationService,
    protected reservationFormService: ReservationFormService,
    protected volService: VolService,
    protected hotelService: HotelService,
    protected activiteService: ActiviteService,
    protected voyageurService: VoyageurService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareVol = (o1: IVol | null, o2: IVol | null): boolean => this.volService.compareVol(o1, o2);

  compareHotel = (o1: IHotel | null, o2: IHotel | null): boolean => this.hotelService.compareHotel(o1, o2);

  compareActivite = (o1: IActivite | null, o2: IActivite | null): boolean => this.activiteService.compareActivite(o1, o2);

  compareVoyageur = (o1: IVoyageur | null, o2: IVoyageur | null): boolean => this.voyageurService.compareVoyageur(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservation }) => {
      this.reservation = reservation;
      if (reservation) {
        this.updateForm(reservation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reservation = this.reservationFormService.getReservation(this.editForm);
    if (reservation.id !== null) {
      this.subscribeToSaveResponse(this.reservationService.update(reservation));
    } else {
      this.subscribeToSaveResponse(this.reservationService.create(reservation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReservation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(reservation: IReservation): void {
    this.reservation = reservation;
    this.reservationFormService.resetForm(this.editForm, reservation);

    this.volsSharedCollection = this.volService.addVolToCollectionIfMissing<IVol>(this.volsSharedCollection, ...(reservation.vols ?? []));
    this.hotelsSharedCollection = this.hotelService.addHotelToCollectionIfMissing<IHotel>(
      this.hotelsSharedCollection,
      ...(reservation.hotels ?? []),
    );
    this.activitesSharedCollection = this.activiteService.addActiviteToCollectionIfMissing<IActivite>(
      this.activitesSharedCollection,
      ...(reservation.activites ?? []),
    );
    this.voyageursSharedCollection = this.voyageurService.addVoyageurToCollectionIfMissing<IVoyageur>(
      this.voyageursSharedCollection,
      reservation.voyageur,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.volService
      .query()
      .pipe(map((res: HttpResponse<IVol[]>) => res.body ?? []))
      .pipe(map((vols: IVol[]) => this.volService.addVolToCollectionIfMissing<IVol>(vols, ...(this.reservation?.vols ?? []))))
      .subscribe((vols: IVol[]) => (this.volsSharedCollection = vols));

    this.hotelService
      .query()
      .pipe(map((res: HttpResponse<IHotel[]>) => res.body ?? []))
      .pipe(map((hotels: IHotel[]) => this.hotelService.addHotelToCollectionIfMissing<IHotel>(hotels, ...(this.reservation?.hotels ?? []))))
      .subscribe((hotels: IHotel[]) => (this.hotelsSharedCollection = hotels));

    this.activiteService
      .query()
      .pipe(map((res: HttpResponse<IActivite[]>) => res.body ?? []))
      .pipe(
        map((activites: IActivite[]) =>
          this.activiteService.addActiviteToCollectionIfMissing<IActivite>(activites, ...(this.reservation?.activites ?? [])),
        ),
      )
      .subscribe((activites: IActivite[]) => (this.activitesSharedCollection = activites));

    this.voyageurService
      .query()
      .pipe(map((res: HttpResponse<IVoyageur[]>) => res.body ?? []))
      .pipe(
        map((voyageurs: IVoyageur[]) =>
          this.voyageurService.addVoyageurToCollectionIfMissing<IVoyageur>(voyageurs, this.reservation?.voyageur),
        ),
      )
      .subscribe((voyageurs: IVoyageur[]) => (this.voyageursSharedCollection = voyageurs));
  }
}
