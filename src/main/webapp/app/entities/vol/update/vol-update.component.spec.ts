import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VolService } from '../service/vol.service';
import { IVol } from '../vol.model';
import { VolFormService } from './vol-form.service';

import { VolUpdateComponent } from './vol-update.component';

describe('Vol Management Update Component', () => {
  let comp: VolUpdateComponent;
  let fixture: ComponentFixture<VolUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let volFormService: VolFormService;
  let volService: VolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), VolUpdateComponent],
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
      .overrideTemplate(VolUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VolUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    volFormService = TestBed.inject(VolFormService);
    volService = TestBed.inject(VolService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const vol: IVol = { id: 456 };

      activatedRoute.data = of({ vol });
      comp.ngOnInit();

      expect(comp.vol).toEqual(vol);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVol>>();
      const vol = { id: 123 };
      jest.spyOn(volFormService, 'getVol').mockReturnValue(vol);
      jest.spyOn(volService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vol });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vol }));
      saveSubject.complete();

      // THEN
      expect(volFormService.getVol).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(volService.update).toHaveBeenCalledWith(expect.objectContaining(vol));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVol>>();
      const vol = { id: 123 };
      jest.spyOn(volFormService, 'getVol').mockReturnValue({ id: null });
      jest.spyOn(volService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vol: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vol }));
      saveSubject.complete();

      // THEN
      expect(volFormService.getVol).toHaveBeenCalled();
      expect(volService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVol>>();
      const vol = { id: 123 };
      jest.spyOn(volService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vol });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(volService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
