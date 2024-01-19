import { IReservation } from 'app/entities/reservation/reservation.model';
import { NotificationType } from 'app/entities/enumerations/notification-type.model';

export interface INotification {
  id: number;
  type?: keyof typeof NotificationType | null;
  contenu?: string | null;
  destinataire?: number | null;
  reservation?: IReservation | null;
}

export type NewNotification = Omit<INotification, 'id'> & { id: null };
