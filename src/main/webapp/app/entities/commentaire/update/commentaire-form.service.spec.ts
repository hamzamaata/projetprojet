import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../commentaire.test-samples';

import { CommentaireFormService } from './commentaire-form.service';

describe('Commentaire Form Service', () => {
  let service: CommentaireFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentaireFormService);
  });

  describe('Service methods', () => {
    describe('createCommentaireFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCommentaireFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            texte: expect.any(Object),
            note: expect.any(Object),
            reservation: expect.any(Object),
          }),
        );
      });

      it('passing ICommentaire should create a new form with FormGroup', () => {
        const formGroup = service.createCommentaireFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            texte: expect.any(Object),
            note: expect.any(Object),
            reservation: expect.any(Object),
          }),
        );
      });
    });

    describe('getCommentaire', () => {
      it('should return NewCommentaire for default Commentaire initial value', () => {
        const formGroup = service.createCommentaireFormGroup(sampleWithNewData);

        const commentaire = service.getCommentaire(formGroup) as any;

        expect(commentaire).toMatchObject(sampleWithNewData);
      });

      it('should return NewCommentaire for empty Commentaire initial value', () => {
        const formGroup = service.createCommentaireFormGroup();

        const commentaire = service.getCommentaire(formGroup) as any;

        expect(commentaire).toMatchObject({});
      });

      it('should return ICommentaire', () => {
        const formGroup = service.createCommentaireFormGroup(sampleWithRequiredData);

        const commentaire = service.getCommentaire(formGroup) as any;

        expect(commentaire).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICommentaire should not enable id FormControl', () => {
        const formGroup = service.createCommentaireFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCommentaire should disable id FormControl', () => {
        const formGroup = service.createCommentaireFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
