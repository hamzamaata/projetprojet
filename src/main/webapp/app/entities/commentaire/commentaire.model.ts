import { IReservation } from 'app/entities/reservation/reservation.model';

export interface ICommentaire {
  id: number;
  texte?: string | null;
  note?: number | null;
  reservation?: IReservation | null;
}

export type NewCommentaire = Omit<ICommentaire, 'id'> & { id: null };
