import { IHotel, NewHotel } from './hotel.model';

export const sampleWithRequiredData: IHotel = {
  id: 30342,
};

export const sampleWithPartialData: IHotel = {
  id: 31627,
};

export const sampleWithFullData: IHotel = {
  id: 19087,
  nom: 'bè de manière à',
  localisation: 'sans que',
};

export const sampleWithNewData: NewHotel = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
