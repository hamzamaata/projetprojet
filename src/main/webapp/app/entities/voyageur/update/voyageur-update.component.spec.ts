import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VoyageurService } from '../service/voyageur.service';
import { IVoyageur } from '../voyageur.model';
import { VoyageurFormService } from './voyageur-form.service';

import { VoyageurUpdateComponent } from './voyageur-update.component';

describe('Voyageur Management Update Component', () => {
  let comp: VoyageurUpdateComponent;
  let fixture: ComponentFixture<VoyageurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let voyageurFormService: VoyageurFormService;
  let voyageurService: VoyageurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), VoyageurUpdateComponent],
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
      .overrideTemplate(VoyageurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoyageurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    voyageurFormService = TestBed.inject(VoyageurFormService);
    voyageurService = TestBed.inject(VoyageurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const voyageur: IVoyageur = { id: 456 };

      activatedRoute.data = of({ voyageur });
      comp.ngOnInit();

      expect(comp.voyageur).toEqual(voyageur);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoyageur>>();
      const voyageur = { id: 123 };
      jest.spyOn(voyageurFormService, 'getVoyageur').mockReturnValue(voyageur);
      jest.spyOn(voyageurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voyageur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voyageur }));
      saveSubject.complete();

      // THEN
      expect(voyageurFormService.getVoyageur).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(voyageurService.update).toHaveBeenCalledWith(expect.objectContaining(voyageur));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoyageur>>();
      const voyageur = { id: 123 };
      jest.spyOn(voyageurFormService, 'getVoyageur').mockReturnValue({ id: null });
      jest.spyOn(voyageurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voyageur: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: voyageur }));
      saveSubject.complete();

      // THEN
      expect(voyageurFormService.getVoyageur).toHaveBeenCalled();
      expect(voyageurService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVoyageur>>();
      const voyageur = { id: 123 };
      jest.spyOn(voyageurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ voyageur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(voyageurService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
