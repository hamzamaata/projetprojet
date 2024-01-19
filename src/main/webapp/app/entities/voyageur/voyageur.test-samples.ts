import { IVoyageur, NewVoyageur } from './voyageur.model';

export const sampleWithRequiredData: IVoyageur = {
  id: 17369,
};

export const sampleWithPartialData: IVoyageur = {
  id: 21662,
  email: 'Palemon42@hotmail.fr',
};

export const sampleWithFullData: IVoyageur = {
  id: 9508,
  nom: 'derechef',
  email: 'Agathange23@gmail.com',
  motDePasse: 'porte-parole aux environs de',
};

export const sampleWithNewData: NewVoyageur = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
