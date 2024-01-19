import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IReservation, NewReservation } from '../reservation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReservation for edit and NewReservationFormGroupInput for create.
 */
type ReservationFormGroupInput = IReservation | PartialWithRequiredKeyOf<NewReservation>;

type ReservationFormDefaults = Pick<NewReservation, 'id' | 'vols' | 'hotels' | 'activites'>;

type ReservationFormGroupContent = {
  id: FormControl<IReservation['id'] | NewReservation['id']>;
  dateDebut: FormControl<IReservation['dateDebut']>;
  dateFin: FormControl<IReservation['dateFin']>;
  typeService: FormControl<IReservation['typeService']>;
  vols: FormControl<IReservation['vols']>;
  hotels: FormControl<IReservation['hotels']>;
  activites: FormControl<IReservation['activites']>;
  voyageur: FormControl<IReservation['voyageur']>;
};

export type ReservationFormGroup = FormGroup<ReservationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReservationFormService {
  createReservationFormGroup(reservation: ReservationFormGroupInput = { id: null }): ReservationFormGroup {
    const reservationRawValue = {
      ...this.getFormDefaults(),
      ...reservation,
    };
    return new FormGroup<ReservationFormGroupContent>({
      id: new FormControl(
        { value: reservationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dateDebut: new FormControl(reservationRawValue.dateDebut),
      dateFin: new FormControl(reservationRawValue.dateFin),
      typeService: new FormControl(reservationRawValue.typeService),
      vols: new FormControl(reservationRawValue.vols ?? []),
      hotels: new FormControl(reservationRawValue.hotels ?? []),
      activites: new FormControl(reservationRawValue.activites ?? []),
      voyageur: new FormControl(reservationRawValue.voyageur),
    });
  }

  getReservation(form: ReservationFormGroup): IReservation | NewReservation {
    return form.getRawValue() as IReservation | NewReservation;
  }

  resetForm(form: ReservationFormGroup, reservation: ReservationFormGroupInput): void {
    const reservationRawValue = { ...this.getFormDefaults(), ...reservation };
    form.reset(
      {
        ...reservationRawValue,
        id: { value: reservationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ReservationFormDefaults {
    return {
      id: null,
      vols: [],
      hotels: [],
      activites: [],
    };
  }
}
