import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VolDetailComponent } from './vol-detail.component';

describe('Vol Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: VolDetailComponent,
              resolve: { vol: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(VolDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load vol on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', VolDetailComponent);

      // THEN
      expect(instance.vol).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
