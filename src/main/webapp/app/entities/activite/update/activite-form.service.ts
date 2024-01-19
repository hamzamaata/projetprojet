import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActivite, NewActivite } from '../activite.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActivite for edit and NewActiviteFormGroupInput for create.
 */
type ActiviteFormGroupInput = IActivite | PartialWithRequiredKeyOf<NewActivite>;

type ActiviteFormDefaults = Pick<NewActivite, 'id'>;

type ActiviteFormGroupContent = {
  id: FormControl<IActivite['id'] | NewActivite['id']>;
  nom: FormControl<IActivite['nom']>;
  description: FormControl<IActivite['description']>;
  lieu: FormControl<IActivite['lieu']>;
};

export type ActiviteFormGroup = FormGroup<ActiviteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActiviteFormService {
  createActiviteFormGroup(activite: ActiviteFormGroupInput = { id: null }): ActiviteFormGroup {
    const activiteRawValue = {
      ...this.getFormDefaults(),
      ...activite,
    };
    return new FormGroup<ActiviteFormGroupContent>({
      id: new FormControl(
        { value: activiteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nom: new FormControl(activiteRawValue.nom),
      description: new FormControl(activiteRawValue.description),
      lieu: new FormControl(activiteRawValue.lieu),
    });
  }

  getActivite(form: ActiviteFormGroup): IActivite | NewActivite {
    return form.getRawValue() as IActivite | NewActivite;
  }

  resetForm(form: ActiviteFormGroup, activite: ActiviteFormGroupInput): void {
    const activiteRawValue = { ...this.getFormDefaults(), ...activite };
    form.reset(
      {
        ...activiteRawValue,
        id: { value: activiteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ActiviteFormDefaults {
    return {
      id: null,
    };
  }
}
