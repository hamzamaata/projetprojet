import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../voyageur.test-samples';

import { VoyageurFormService } from './voyageur-form.service';

describe('Voyageur Form Service', () => {
  let service: VoyageurFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoyageurFormService);
  });

  describe('Service methods', () => {
    describe('createVoyageurFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVoyageurFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            email: expect.any(Object),
            motDePasse: expect.any(Object),
          }),
        );
      });

      it('passing IVoyageur should create a new form with FormGroup', () => {
        const formGroup = service.createVoyageurFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nom: expect.any(Object),
            email: expect.any(Object),
            motDePasse: expect.any(Object),
          }),
        );
      });
    });

    describe('getVoyageur', () => {
      it('should return NewVoyageur for default Voyageur initial value', () => {
        const formGroup = service.createVoyageurFormGroup(sampleWithNewData);

        const voyageur = service.getVoyageur(formGroup) as any;

        expect(voyageur).toMatchObject(sampleWithNewData);
      });

      it('should return NewVoyageur for empty Voyageur initial value', () => {
        const formGroup = service.createVoyageurFormGroup();

        const voyageur = service.getVoyageur(formGroup) as any;

        expect(voyageur).toMatchObject({});
      });

      it('should return IVoyageur', () => {
        const formGroup = service.createVoyageurFormGroup(sampleWithRequiredData);

        const voyageur = service.getVoyageur(formGroup) as any;

        expect(voyageur).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVoyageur should not enable id FormControl', () => {
        const formGroup = service.createVoyageurFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVoyageur should disable id FormControl', () => {
        const formGroup = service.createVoyageurFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
