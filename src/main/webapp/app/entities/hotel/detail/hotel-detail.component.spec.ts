import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HotelDetailComponent } from './hotel-detail.component';

describe('Hotel Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: HotelDetailComponent,
              resolve: { hotel: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(HotelDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load hotel on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', HotelDetailComponent);

      // THEN
      expect(instance.hotel).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
