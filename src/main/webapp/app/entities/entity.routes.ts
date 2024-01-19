import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'voyageur',
    data: { pageTitle: 'Voyageurs' },
    loadChildren: () => import('./voyageur/voyageur.routes'),
  },
  {
    path: 'reservation',
    data: { pageTitle: 'Reservations' },
    loadChildren: () => import('./reservation/reservation.routes'),
  },
  {
    path: 'vol',
    data: { pageTitle: 'Vols' },
    loadChildren: () => import('./vol/vol.routes'),
  },
  {
    path: 'hotel',
    data: { pageTitle: 'Hotels' },
    loadChildren: () => import('./hotel/hotel.routes'),
  },
  {
    path: 'activite',
    data: { pageTitle: 'Activites' },
    loadChildren: () => import('./activite/activite.routes'),
  },
  {
    path: 'paiement',
    data: { pageTitle: 'Paiements' },
    loadChildren: () => import('./paiement/paiement.routes'),
  },
  {
    path: 'notification',
    data: { pageTitle: 'Notifications' },
    loadChildren: () => import('./notification/notification.routes'),
  },
  {
    path: 'commentaire',
    data: { pageTitle: 'Commentaires' },
    loadChildren: () => import('./commentaire/commentaire.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
