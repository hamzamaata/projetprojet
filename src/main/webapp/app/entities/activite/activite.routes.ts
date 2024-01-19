import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ActiviteComponent } from './list/activite.component';
import { ActiviteDetailComponent } from './detail/activite-detail.component';
import { ActiviteUpdateComponent } from './update/activite-update.component';
import ActiviteResolve from './route/activite-routing-resolve.service';

const activiteRoute: Routes = [
  {
    path: '',
    component: ActiviteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActiviteDetailComponent,
    resolve: {
      activite: ActiviteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActiviteUpdateComponent,
    resolve: {
      activite: ActiviteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActiviteUpdateComponent,
    resolve: {
      activite: ActiviteResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default activiteRoute;
