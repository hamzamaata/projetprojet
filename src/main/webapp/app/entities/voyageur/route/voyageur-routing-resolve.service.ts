import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVoyageur } from '../voyageur.model';
import { VoyageurService } from '../service/voyageur.service';

export const voyageurResolve = (route: ActivatedRouteSnapshot): Observable<null | IVoyageur> => {
  const id = route.params['id'];
  if (id) {
    return inject(VoyageurService)
      .find(id)
      .pipe(
        mergeMap((voyageur: HttpResponse<IVoyageur>) => {
          if (voyageur.body) {
            return of(voyageur.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default voyageurResolve;
