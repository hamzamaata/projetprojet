import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReservationDetailComponent } from './reservation-detail.component';

describe('Reservation Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ReservationDetailComponent,
              resolve: { reservation: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ReservationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load reservation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ReservationDetailComponent);

      // THEN
      expect(instance.reservation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
