import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PaiementService } from '../service/paiement.service';

import { PaiementComponent } from './paiement.component';

describe('Paiement Management Component', () => {
  let comp: PaiementComponent;
  let fixture: ComponentFixture<PaiementComponent>;
  let service: PaiementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'paiement', component: PaiementComponent }]),
        HttpClientTestingModule,
        PaiementComponent,
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
      .overrideTemplate(PaiementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaiementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PaiementService);

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
    expect(comp.paiements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to paiementService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPaiementIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPaiementIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
