import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { VolComponent } from './list/vol.component';
import { VolDetailComponent } from './detail/vol-detail.component';
import { VolUpdateComponent } from './update/vol-update.component';
import VolResolve from './route/vol-routing-resolve.service';

const volRoute: Routes = [
  {
    path: '',
    component: VolComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VolDetailComponent,
    resolve: {
      vol: VolResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VolUpdateComponent,
    resolve: {
      vol: VolResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VolUpdateComponent,
    resolve: {
      vol: VolResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default volRoute;
