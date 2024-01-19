import { IReservation } from 'app/entities/reservation/reservation.model';

export interface IVoyageur {
  id: number;
  nom?: string | null;
  email?: string | null;
  motDePasse?: string | null;
  reservations?: IReservation[] | null;
}

export type NewVoyageur = Omit<IVoyageur, 'id'> & { id: null };
