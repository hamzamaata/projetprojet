import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CommentaireService } from '../service/commentaire.service';

import { CommentaireComponent } from './commentaire.component';

describe('Commentaire Management Component', () => {
  let comp: CommentaireComponent;
  let fixture: ComponentFixture<CommentaireComponent>;
  let service: CommentaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'commentaire', component: CommentaireComponent }]),
        HttpClientTestingModule,
        CommentaireComponent,
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
      .overrideTemplate(CommentaireComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommentaireComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CommentaireService);

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
    expect(comp.commentaires?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to commentaireService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCommentaireIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCommentaireIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
