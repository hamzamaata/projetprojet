import { ICommentaire, NewCommentaire } from './commentaire.model';

export const sampleWithRequiredData: ICommentaire = {
  id: 21574,
};

export const sampleWithPartialData: ICommentaire = {
  id: 17106,
  texte: 'extrêmement',
  note: 19006,
};

export const sampleWithFullData: ICommentaire = {
  id: 20645,
  texte: 'de peur de',
  note: 30476,
};

export const sampleWithNewData: NewCommentaire = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
