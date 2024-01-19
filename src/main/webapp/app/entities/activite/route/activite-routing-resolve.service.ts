import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActivite } from '../activite.model';
import { ActiviteService } from '../service/activite.service';

export const activiteResolve = (route: ActivatedRouteSnapshot): Observable<null | IActivite> => {
  const id = route.params['id'];
  if (id) {
    return inject(ActiviteService)
      .find(id)
      .pipe(
        mergeMap((activite: HttpResponse<IActivite>) => {
          if (activite.body) {
            return of(activite.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default activiteResolve;
