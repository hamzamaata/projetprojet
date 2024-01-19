import dayjs from 'dayjs/esm';
import { IReservation } from 'app/entities/reservation/reservation.model';

export interface IPaiement {
  id: number;
  montant?: number | null;
  datePaiement?: dayjs.Dayjs | null;
  reservation?: IReservation | null;
}

export type NewPaiement = Omit<IPaiement, 'id'> & { id: null };
