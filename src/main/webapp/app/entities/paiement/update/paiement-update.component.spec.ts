import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IReservation } from 'app/entities/reservation/reservation.model';
import { ReservationService } from 'app/entities/reservation/service/reservation.service';
import { PaiementService } from '../service/paiement.service';
import { IPaiement } from '../paiement.model';
import { PaiementFormService } from './paiement-form.service';

import { PaiementUpdateComponent } from './paiement-update.component';

describe('Paiement Management Update Component', () => {
  let comp: PaiementUpdateComponent;
  let fixture: ComponentFixture<PaiementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paiementFormService: PaiementFormService;
  let paiementService: PaiementService;
  let reservationService: ReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PaiementUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PaiementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaiementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paiementFormService = TestBed.inject(PaiementFormService);
    paiementService = TestBed.inject(PaiementService);
    reservationService = TestBed.inject(ReservationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Reservation query and add missing value', () => {
      const paiement: IPaiement = { id: 456 };
      const reservation: IReservation = { id: 13015 };
      paiement.reservation = reservation;

      const reservationCollection: IReservation[] = [{ id: 26756 }];
      jest.spyOn(reservationService, 'query').mockReturnValue(of(new HttpResponse({ body: reservationCollection })));
      const additionalReservations = [reservation];
      const expectedCollection: IReservation[] = [...additionalReservations, ...reservationCollection];
      jest.spyOn(reservationService, 'addReservationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      expect(reservationService.query).toHaveBeenCalled();
      expect(reservationService.addReservationToCollectionIfMissing).toHaveBeenCalledWith(
        reservationCollection,
        ...additionalReservations.map(expect.objectContaining),
      );
      expect(comp.reservationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paiement: IPaiement = { id: 456 };
      const reservation: IReservation = { id: 7097 };
      paiement.reservation = reservation;

      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      expect(comp.reservationsSharedCollection).toContain(reservation);
      expect(comp.paiement).toEqual(paiement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPaiement>>();
      const paiement = { id: 123 };
      jest.spyOn(paiementFormService, 'getPaiement').mockReturnValue(paiement);
      jest.spyOn(paiementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paiement }));
      saveSubject.complete();

      // THEN
      expect(paiementFormService.getPaiement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(paiementService.update).toHaveBeenCalledWith(expect.objectContaining(paiement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPaiement>>();
      const paiement = { id: 123 };
      jest.spyOn(paiementFormService, 'getPaiement').mockReturnValue({ id: null });
      jest.spyOn(paiementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paiement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paiement }));
      saveSubject.complete();

      // THEN
      expect(paiementFormService.getPaiement).toHaveBeenCalled();
      expect(paiementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPaiement>>();
      const paiement = { id: 123 };
      jest.spyOn(paiementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paiement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paiementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareReservation', () => {
      it('Should forward to reservationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(reservationService, 'compareReservation');
        comp.compareReservation(entity, entity2);
        expect(reservationService.compareReservation).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
