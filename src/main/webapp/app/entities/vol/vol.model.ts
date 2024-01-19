import { IReservation } from 'app/entities/reservation/reservation.model';

export interface IVol {
  id: number;
  compagnie?: string | null;
  horaire?: string | null;
  tarif?: number | null;
  siegesDisponibles?: number | null;
  reservations?: IReservation[] | null;
}

export type NewVol = Omit<IVol, 'id'> & { id: null };
