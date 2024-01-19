import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { VoyageurComponent } from './list/voyageur.component';
import { VoyageurDetailComponent } from './detail/voyageur-detail.component';
import { VoyageurUpdateComponent } from './update/voyageur-update.component';
import VoyageurResolve from './route/voyageur-routing-resolve.service';

const voyageurRoute: Routes = [
  {
    path: '',
    component: VoyageurComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VoyageurDetailComponent,
    resolve: {
      voyageur: VoyageurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VoyageurUpdateComponent,
    resolve: {
      voyageur: VoyageurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VoyageurUpdateComponent,
    resolve: {
      voyageur: VoyageurResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default voyageurRoute;
