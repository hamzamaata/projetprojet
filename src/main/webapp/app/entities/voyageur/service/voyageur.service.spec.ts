import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVoyageur } from '../voyageur.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../voyageur.test-samples';

import { VoyageurService } from './voyageur.service';

const requireRestSample: IVoyageur = {
  ...sampleWithRequiredData,
};

describe('Voyageur Service', () => {
  let service: VoyageurService;
  let httpMock: HttpTestingController;
  let expectedResult: IVoyageur | IVoyageur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VoyageurService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Voyageur', () => {
      const voyageur = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(voyageur).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Voyageur', () => {
      const voyageur = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(voyageur).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Voyageur', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Voyageur', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Voyageur', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVoyageurToCollectionIfMissing', () => {
      it('should add a Voyageur to an empty array', () => {
        const voyageur: IVoyageur = sampleWithRequiredData;
        expectedResult = service.addVoyageurToCollectionIfMissing([], voyageur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voyageur);
      });

      it('should not add a Voyageur to an array that contains it', () => {
        const voyageur: IVoyageur = sampleWithRequiredData;
        const voyageurCollection: IVoyageur[] = [
          {
            ...voyageur,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVoyageurToCollectionIfMissing(voyageurCollection, voyageur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Voyageur to an array that doesn't contain it", () => {
        const voyageur: IVoyageur = sampleWithRequiredData;
        const voyageurCollection: IVoyageur[] = [sampleWithPartialData];
        expectedResult = service.addVoyageurToCollectionIfMissing(voyageurCollection, voyageur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voyageur);
      });

      it('should add only unique Voyageur to an array', () => {
        const voyageurArray: IVoyageur[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const voyageurCollection: IVoyageur[] = [sampleWithRequiredData];
        expectedResult = service.addVoyageurToCollectionIfMissing(voyageurCollection, ...voyageurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const voyageur: IVoyageur = sampleWithRequiredData;
        const voyageur2: IVoyageur = sampleWithPartialData;
        expectedResult = service.addVoyageurToCollectionIfMissing([], voyageur, voyageur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(voyageur);
        expect(expectedResult).toContain(voyageur2);
      });

      it('should accept null and undefined values', () => {
        const voyageur: IVoyageur = sampleWithRequiredData;
        expectedResult = service.addVoyageurToCollectionIfMissing([], null, voyageur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(voyageur);
      });

      it('should return initial array if no Voyageur is added', () => {
        const voyageurCollection: IVoyageur[] = [sampleWithRequiredData];
        expectedResult = service.addVoyageurToCollectionIfMissing(voyageurCollection, undefined, null);
        expect(expectedResult).toEqual(voyageurCollection);
      });
    });

    describe('compareVoyageur', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVoyageur(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVoyageur(entity1, entity2);
        const compareResult2 = service.compareVoyageur(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVoyageur(entity1, entity2);
        const compareResult2 = service.compareVoyageur(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVoyageur(entity1, entity2);
        const compareResult2 = service.compareVoyageur(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
