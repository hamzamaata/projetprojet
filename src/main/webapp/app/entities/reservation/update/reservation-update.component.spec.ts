import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IVol } from 'app/entities/vol/vol.model';
import { VolService } from 'app/entities/vol/service/vol.service';
import { IHotel } from 'app/entities/hotel/hotel.model';
import { HotelService } from 'app/entities/hotel/service/hotel.service';
import { IActivite } from 'app/entities/activite/activite.model';
import { ActiviteService } from 'app/entities/activite/service/activite.service';
import { IVoyageur } from 'app/entities/voyageur/voyageur.model';
import { VoyageurService } from 'app/entities/voyageur/service/voyageur.service';
import { IReservation } from '../reservation.model';
import { ReservationService } from '../service/reservation.service';
import { ReservationFormService } from './reservation-form.service';

import { ReservationUpdateComponent } from './reservation-update.component';

describe('Reservation Management Update Component', () => {
  let comp: ReservationUpdateComponent;
  let fixture: ComponentFixture<ReservationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reservationFormService: ReservationFormService;
  let reservationService: ReservationService;
  let volService: VolService;
  let hotelService: HotelService;
  let activiteService: ActiviteService;
  let voyageurService: VoyageurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ReservationUpdateComponent],
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
      .overrideTemplate(ReservationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReservationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reservationFormService = TestBed.inject(ReservationFormService);
    reservationService = TestBed.inject(ReservationService);
    volService = TestBed.inject(VolService);
    hotelService = TestBed.inject(HotelService);
    activiteService = TestBed.inject(ActiviteService);
    voyageurService = TestBed.inject(VoyageurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Vol query and add missing value', () => {
      const reservation: IReservation = { id: 456 };
      const vols: IVol[] = [{ id: 22849 }];
      reservation.vols = vols;

      const volCollection: IVol[] = [{ id: 17106 }];
      jest.spyOn(volService, 'query').mockReturnValue(of(new HttpResponse({ body: volCollection })));
      const additionalVols = [...vols];
      const expectedCollection: IVol[] = [...additionalVols, ...volCollection];
      jest.spyOn(volService, 'addVolToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(volService.query).toHaveBeenCalled();
      expect(volService.addVolToCollectionIfMissing).toHaveBeenCalledWith(volCollection, ...additionalVols.map(expect.objectContaining));
      expect(comp.volsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Hotel query and add missing value', () => {
      const reservation: IReservation = { id: 456 };
      const hotels: IHotel[] = [{ id: 4692 }];
      reservation.hotels = hotels;

      const hotelCollection: IHotel[] = [{ id: 17597 }];
      jest.spyOn(hotelService, 'query').mockReturnValue(of(new HttpResponse({ body: hotelCollection })));
      const additionalHotels = [...hotels];
      const expectedCollection: IHotel[] = [...additionalHotels, ...hotelCollection];
      jest.spyOn(hotelService, 'addHotelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(hotelService.query).toHaveBeenCalled();
      expect(hotelService.addHotelToCollectionIfMissing).toHaveBeenCalledWith(
        hotelCollection,
        ...additionalHotels.map(expect.objectContaining),
      );
      expect(comp.hotelsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Activite query and add missing value', () => {
      const reservation: IReservation = { id: 456 };
      const activites: IActivite[] = [{ id: 18204 }];
      reservation.activites = activites;

      const activiteCollection: IActivite[] = [{ id: 3143 }];
      jest.spyOn(activiteService, 'query').mockReturnValue(of(new HttpResponse({ body: activiteCollection })));
      const additionalActivites = [...activites];
      const expectedCollection: IActivite[] = [...additionalActivites, ...activiteCollection];
      jest.spyOn(activiteService, 'addActiviteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(activiteService.query).toHaveBeenCalled();
      expect(activiteService.addActiviteToCollectionIfMissing).toHaveBeenCalledWith(
        activiteCollection,
        ...additionalActivites.map(expect.objectContaining),
      );
      expect(comp.activitesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Voyageur query and add missing value', () => {
      const reservation: IReservation = { id: 456 };
      const voyageur: IVoyageur = { id: 25612 };
      reservation.voyageur = voyageur;

      const voyageurCollection: IVoyageur[] = [{ id: 4244 }];
      jest.spyOn(voyageurService, 'query').mockReturnValue(of(new HttpResponse({ body: voyageurCollection })));
      const additionalVoyageurs = [voyageur];
      const expectedCollection: IVoyageur[] = [...additionalVoyageurs, ...voyageurCollection];
      jest.spyOn(voyageurService, 'addVoyageurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(voyageurService.query).toHaveBeenCalled();
      expect(voyageurService.addVoyageurToCollectionIfMissing).toHaveBeenCalledWith(
        voyageurCollection,
        ...additionalVoyageurs.map(expect.objectContaining),
      );
      expect(comp.voyageursSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reservation: IReservation = { id: 456 };
      const vols: IVol = { id: 10947 };
      reservation.vols = [vols];
      const hotels: IHotel = { id: 5679 };
      reservation.hotels = [hotels];
      const activites: IActivite = { id: 13150 };
      reservation.activites = [activites];
      const voyageur: IVoyageur = { id: 9098 };
      reservation.voyageur = voyageur;

      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      expect(comp.volsSharedCollection).toContain(vols);
      expect(comp.hotelsSharedCollection).toContain(hotels);
      expect(comp.activitesSharedCollection).toContain(activites);
      expect(comp.voyageursSharedCollection).toContain(voyageur);
      expect(comp.reservation).toEqual(reservation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReservation>>();
      const reservation = { id: 123 };
      jest.spyOn(reservationFormService, 'getReservation').mockReturnValue(reservation);
      jest.spyOn(reservationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reservation }));
      saveSubject.complete();

      // THEN
      expect(reservationFormService.getReservation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reservationService.update).toHaveBeenCalledWith(expect.objectContaining(reservation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReservation>>();
      const reservation = { id: 123 };
      jest.spyOn(reservationFormService, 'getReservation').mockReturnValue({ id: null });
      jest.spyOn(reservationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reservation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reservation }));
      saveSubject.complete();

      // THEN
      expect(reservationFormService.getReservation).toHaveBeenCalled();
      expect(reservationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReservation>>();
      const reservation = { id: 123 };
      jest.spyOn(reservationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reservation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reservationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVol', () => {
      it('Should forward to volService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(volService, 'compareVol');
        comp.compareVol(entity, entity2);
        expect(volService.compareVol).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareHotel', () => {
      it('Should forward to hotelService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(hotelService, 'compareHotel');
        comp.compareHotel(entity, entity2);
        expect(hotelService.compareHotel).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareActivite', () => {
      it('Should forward to activiteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activiteService, 'compareActivite');
        comp.compareActivite(entity, entity2);
        expect(activiteService.compareActivite).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareVoyageur', () => {
      it('Should forward to voyageurService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(voyageurService, 'compareVoyageur');
        comp.compareVoyageur(entity, entity2);
        expect(voyageurService.compareVoyageur).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
