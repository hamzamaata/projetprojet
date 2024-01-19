import dayjs from 'dayjs/esm';

import { IReservation, NewReservation } from './reservation.model';

export const sampleWithRequiredData: IReservation = {
  id: 18203,
};

export const sampleWithPartialData: IReservation = {
  id: 28189,
  dateFin: dayjs('2024-01-09'),
  typeService: 'HOTEL',
};

export const sampleWithFullData: IReservation = {
  id: 27702,
  dateDebut: dayjs('2024-01-09'),
  dateFin: dayjs('2024-01-09'),
  typeService: 'HOTEL',
};

export const sampleWithNewData: NewReservation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
