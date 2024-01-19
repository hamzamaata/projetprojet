import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 21229,
};

export const sampleWithPartialData: INotification = {
  id: 12338,
  type: 'ALERTE',
  contenu: 'sans foule',
};

export const sampleWithFullData: INotification = {
  id: 31946,
  type: 'ANNULATION',
  contenu: "près puisque à l'entour de",
  destinataire: 7252,
};

export const sampleWithNewData: NewNotification = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
