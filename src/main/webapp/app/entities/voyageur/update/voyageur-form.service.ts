import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVoyageur, NewVoyageur } from '../voyageur.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVoyageur for edit and NewVoyageurFormGroupInput for create.
 */
type VoyageurFormGroupInput = IVoyageur | PartialWithRequiredKeyOf<NewVoyageur>;

type VoyageurFormDefaults = Pick<NewVoyageur, 'id'>;

type VoyageurFormGroupContent = {
  id: FormControl<IVoyageur['id'] | NewVoyageur['id']>;
  nom: FormControl<IVoyageur['nom']>;
  email: FormControl<IVoyageur['email']>;
  motDePasse: FormControl<IVoyageur['motDePasse']>;
};

export type VoyageurFormGroup = FormGroup<VoyageurFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VoyageurFormService {
  createVoyageurFormGroup(voyageur: VoyageurFormGroupInput = { id: null }): VoyageurFormGroup {
    const voyageurRawValue = {
      ...this.getFormDefaults(),
      ...voyageur,
    };
    return new FormGroup<VoyageurFormGroupContent>({
      id: new FormControl(
        { value: voyageurRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(voyageurRawValue.nom),
      email: new FormControl(voyageurRawValue.email),
      motDePasse: new FormControl(voyageurRawValue.motDePasse),
    });
  }

  getVoyageur(form: VoyageurFormGroup): IVoyageur | NewVoyageur {
    return form.getRawValue() as IVoyageur | NewVoyageur;
  }

  resetForm(form: VoyageurFormGroup, voyageur: VoyageurFormGroupInput): void {
    const voyageurRawValue = { ...this.getFormDefaults(), ...voyageur };
    form.reset(
      {
        ...voyageurRawValue,
        id: { value: voyageurRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): VoyageurFormDefaults {
    return {
      id: null,
    };
  }
}
