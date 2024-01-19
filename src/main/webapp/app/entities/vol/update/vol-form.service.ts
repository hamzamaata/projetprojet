import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVol, NewVol } from '../vol.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVol for edit and NewVolFormGroupInput for create.
 */
type VolFormGroupInput = IVol | PartialWithRequiredKeyOf<NewVol>;

type VolFormDefaults = Pick<NewVol, 'id'>;

type VolFormGroupContent = {
  id: FormControl<IVol['id'] | NewVol['id']>;
  compagnie: FormControl<IVol['compagnie']>;
  horaire: FormControl<IVol['horaire']>;
  tarif: FormControl<IVol['tarif']>;
  siegesDisponibles: FormControl<IVol['siegesDisponibles']>;
};

export type VolFormGroup = FormGroup<VolFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VolFormService {
  createVolFormGroup(vol: VolFormGroupInput = { id: null }): VolFormGroup {
    const volRawValue = {
      ...this.getFormDefaults(),
      ...vol,
    };
    return new FormGroup<VolFormGroupContent>({
      id: new FormControl(
        { value: volRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      compagnie: new FormControl(volRawValue.compagnie),
      horaire: new FormControl(volRawValue.horaire),
      tarif: new FormControl(volRawValue.tarif),
      siegesDisponibles: new FormControl(volRawValue.siegesDisponibles),
    });
  }

  getVol(form: VolFormGroup): IVol | NewVol {
    return form.getRawValue() as IVol | NewVol;
  }

  resetForm(form: VolFormGroup, vol: VolFormGroupInput): void {
    const volRawValue = { ...this.getFormDefaults(), ...vol };
    form.reset(
      {
        ...volRawValue,
        id: { value: volRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VolFormDefaults {
    return {
      id: null,
    };
  }
}
