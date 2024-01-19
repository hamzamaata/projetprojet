import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CommentaireDetailComponent } from './commentaire-detail.component';

describe('Commentaire Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentaireDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CommentaireDetailComponent,
              resolve: { commentaire: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CommentaireDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load commentaire on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CommentaireDetailComponent);

      // THEN
      expect(instance.commentaire).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
