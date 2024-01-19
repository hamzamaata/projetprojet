import { IReservation } from 'app/entities/reservation/reservation.model';

export interface IHotel {
  id: number;
  nom?: string | null;
  localisation?: string | null;
  reservations?: IReservation[] | null;
}

export type NewHotel = Omit<IHotel, 'id'> & { id: null };
