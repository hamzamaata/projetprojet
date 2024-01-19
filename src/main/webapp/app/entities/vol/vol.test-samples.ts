import { IVol, NewVol } from './vol.model';

export const sampleWithRequiredData: IVol = {
  id: 9910,
};

export const sampleWithPartialData: IVol = {
  id: 15058,
};

export const sampleWithFullData: IVol = {
  id: 26034,
  compagnie: 'au point que',
  horaire: 'lorsque dring un peu',
  tarif: 22008.79,
  siegesDisponibles: 21478,
};

export const sampleWithNewData: NewVol = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
