import { IActivite, NewActivite } from './activite.model';

export const sampleWithRequiredData: IActivite = {
  id: 21862,
};

export const sampleWithPartialData: IActivite = {
  id: 24904,
  nom: 'trop athlète',
};

export const sampleWithFullData: IActivite = {
  id: 5103,
  nom: 'snif publier énorme',
  description: 'voter',
  lieu: 'délectable',
};

export const sampleWithNewData: NewActivite = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
