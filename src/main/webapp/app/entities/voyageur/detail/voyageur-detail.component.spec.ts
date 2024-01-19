import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VoyageurDetailComponent } from './voyageur-detail.component';

describe('Voyageur Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyageurDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: VoyageurDetailComponent,
              resolve: { voyageur: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(VoyageurDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load voyageur on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', VoyageurDetailComponent);

      // THEN
      expect(instance.voyageur).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
