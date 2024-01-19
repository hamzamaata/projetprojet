import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IReservation } from 'app/entities/reservation/reservation.model';
import { ReservationService } from 'app/entities/reservation/service/reservation.service';
import { CommentaireService } from '../service/commentaire.service';
import { ICommentaire } from '../commentaire.model';
import { CommentaireFormService } from './commentaire-form.service';

import { CommentaireUpdateComponent } from './commentaire-update.component';

describe('Commentaire Management Update Component', () => {
  let comp: CommentaireUpdateComponent;
  let fixture: ComponentFixture<CommentaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commentaireFormService: CommentaireFormService;
  let commentaireService: CommentaireService;
  let reservationService: ReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CommentaireUpdateComponent],
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
      .overrideTemplate(CommentaireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommentaireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commentaireFormService = TestBed.inject(CommentaireFormService);
    commentaireService = TestBed.inject(CommentaireService);
    reservationService = TestBed.inject(ReservationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Reservation query and add missing value', () => {
      const commentaire: ICommentaire = { id: 456 };
      const reservation: IReservation = { id: 32649 };
      commentaire.reservation = reservation;

      const reservationCollection: IReservation[] = [{ id: 25512 }];
      jest.spyOn(reservationService, 'query').mockReturnValue(of(new HttpResponse({ body: reservationCollection })));
      const additionalReservations = [reservation];
      const expectedCollection: IReservation[] = [...additionalReservations, ...reservationCollection];
      jest.spyOn(reservationService, 'addReservationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commentaire });
      comp.ngOnInit();

      expect(reservationService.query).toHaveBeenCalled();
      expect(reservationService.addReservationToCollectionIfMissing).toHaveBeenCalledWith(
        reservationCollection,
        ...additionalReservations.map(expect.objectContaining),
      );
      expect(comp.reservationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const commentaire: ICommentaire = { id: 456 };
      const reservation: IReservation = { id: 8205 };
      commentaire.reservation = reservation;

      activatedRoute.data = of({ commentaire });
      comp.ngOnInit();

      expect(comp.reservationsSharedCollection).toContain(reservation);
      expect(comp.commentaire).toEqual(commentaire);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommentaire>>();
      const commentaire = { id: 123 };
      jest.spyOn(commentaireFormService, 'getCommentaire').mockReturnValue(commentaire);
      jest.spyOn(commentaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commentaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commentaire }));
      saveSubject.complete();

      // THEN
      expect(commentaireFormService.getCommentaire).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(commentaireService.update).toHaveBeenCalledWith(expect.objectContaining(commentaire));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommentaire>>();
      const commentaire = { id: 123 };
      jest.spyOn(commentaireFormService, 'getCommentaire').mockReturnValue({ id: null });
      jest.spyOn(commentaireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commentaire: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commentaire }));
      saveSubject.complete();

      // THEN
      expect(commentaireFormService.getCommentaire).toHaveBeenCalled();
      expect(commentaireService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommentaire>>();
      const commentaire = { id: 123 };
      jest.spyOn(commentaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commentaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commentaireService.update).toHaveBeenCalled();
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
