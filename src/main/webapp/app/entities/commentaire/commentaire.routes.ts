import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CommentaireComponent } from './list/commentaire.component';
import { CommentaireDetailComponent } from './detail/commentaire-detail.component';
import { CommentaireUpdateComponent } from './update/commentaire-update.component';
import CommentaireResolve from './route/commentaire-routing-resolve.service';

const commentaireRoute: Routes = [
  {
    path: '',
    component: CommentaireComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommentaireDetailComponent,
    resolve: {
      commentaire: CommentaireResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommentaireUpdateComponent,
    resolve: {
      commentaire: CommentaireResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommentaireUpdateComponent,
    resolve: {
      commentaire: CommentaireResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default commentaireRoute;
