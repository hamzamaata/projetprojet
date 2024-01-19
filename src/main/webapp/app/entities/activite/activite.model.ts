import { IReservation } from 'app/entities/reservation/reservation.model';

export interface IActivite {
  id: number;
  nom?: string | null;
  description?: string | null;
  lieu?: string | null;
  reservations?: IReservation[] | null;
}

export type NewActivite = Omit<IActivite, 'id'> & { id: null };
