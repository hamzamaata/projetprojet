import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActiviteDetailComponent } from './activite-detail.component';

describe('Activite Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiviteDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ActiviteDetailComponent,
              resolve: { activite: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ActiviteDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load activite on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ActiviteDetailComponent);

      // THEN
      expect(instance.activite).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
