import dayjs from 'dayjs/esm';
import { IVol } from 'app/entities/vol/vol.model';
import { IHotel } from 'app/entities/hotel/hotel.model';
import { IActivite } from 'app/entities/activite/activite.model';
import { IVoyageur } from 'app/entities/voyageur/voyageur.model';
import { IPaiement } from 'app/entities/paiement/paiement.model';
import { INotification } from 'app/entities/notification/notification.model';
import { ICommentaire } from 'app/entities/commentaire/commentaire.model';
import { ServiceType } from 'app/entities/enumerations/service-type.model';

export interface IReservation {
  id: number;
  dateDebut?: dayjs.Dayjs | null;
  dateFin?: dayjs.Dayjs | null;
  typeService?: keyof typeof ServiceType | null;
  vols?: IVol[] | null;
  hotels?: IHotel[] | null;
  activites?: IActivite[] | null;
  voyageur?: IVoyageur | null;
  paiements?: IPaiement[] | null;
  notifications?: INotification[] | null;
  commentaires?: ICommentaire[] | null;
}

export type NewReservation = Omit<IReservation, 'id'> & { id: null };
