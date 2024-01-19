import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICommentaire } from '../commentaire.model';
import { CommentaireService } from '../service/commentaire.service';

export const commentaireResolve = (route: ActivatedRouteSnapshot): Observable<null | ICommentaire> => {
  const id = route.params['id'];
  if (id) {
    return inject(CommentaireService)
      .find(id)
      .pipe(
        mergeMap((commentaire: HttpResponse<ICommentaire>) => {
          if (commentaire.body) {
            return of(commentaire.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default commentaireResolve;
