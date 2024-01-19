import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICommentaire, NewCommentaire } from '../commentaire.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICommentaire for edit and NewCommentaireFormGroupInput for create.
 */
type CommentaireFormGroupInput = ICommentaire | PartialWithRequiredKeyOf<NewCommentaire>;

type CommentaireFormDefaults = Pick<NewCommentaire, 'id'>;

type CommentaireFormGroupContent = {
  id: FormControl<ICommentaire['id'] | NewCommentaire['id']>;
  texte: FormControl<ICommentaire['texte']>;
  note: FormControl<ICommentaire['note']>;
  reservation: FormControl<ICommentaire['reservation']>;
};

export type CommentaireFormGroup = FormGroup<CommentaireFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CommentaireFormService {
  createCommentaireFormGroup(commentaire: CommentaireFormGroupInput = { id: null }): CommentaireFormGroup {
    const commentaireRawValue = {
      ...this.getFormDefaults(),
      ...commentaire,
    };
    return new FormGroup<CommentaireFormGroupContent>({
      id: new FormControl(
        { value: commentaireRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      texte: new FormControl(commentaireRawValue.texte),
      note: new FormControl(commentaireRawValue.note),
      reservation: new FormControl(commentaireRawValue.reservation),
    });
  }

  getCommentaire(form: CommentaireFormGroup): ICommentaire | NewCommentaire {
    return form.getRawValue() as ICommentaire | NewCommentaire;
  }

  resetForm(form: CommentaireFormGroup, commentaire: CommentaireFormGroupInput): void {
    const commentaireRawValue = { ...this.getFormDefaults(), ...commentaire };
    form.reset(
      {
        ...commentaireRawValue,
        id: { value: commentaireRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CommentaireFormDefaults {
    return {
      id: null,
    };
  }
}
