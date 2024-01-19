import dayjs from 'dayjs/esm';

import { IPaiement, NewPaiement } from './paiement.model';

export const sampleWithRequiredData: IPaiement = {
  id: 3763,
};

export const sampleWithPartialData: IPaiement = {
  id: 17261,
  montant: 6553.74,
  datePaiement: dayjs('2024-01-08T15:57'),
};

export const sampleWithFullData: IPaiement = {
  id: 25672,
  montant: 17528.96,
  datePaiement: dayjs('2024-01-08T20:22'),
};

export const sampleWithNewData: NewPaiement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
