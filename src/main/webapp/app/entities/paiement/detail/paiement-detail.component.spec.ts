import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PaiementDetailComponent } from './paiement-detail.component';

describe('Paiement Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: PaiementDetailComponent,
              resolve: { paiement: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PaiementDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load paiement on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PaiementDetailComponent);

      // THEN
      expect(instance.paiement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
