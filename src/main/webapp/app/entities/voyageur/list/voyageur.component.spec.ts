import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VoyageurService } from '../service/voyageur.service';

import { VoyageurComponent } from './voyageur.component';

describe('Voyageur Management Component', () => {
  let comp: VoyageurComponent;
  let fixture: ComponentFixture<VoyageurComponent>;
  let service: VoyageurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'voyageur', component: VoyageurComponent }]),
        HttpClientTestingModule,
        VoyageurComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(VoyageurComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VoyageurComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VoyageurService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.voyageurs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to voyageurService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVoyageurIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVoyageurIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
