import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICommentaire } from '../commentaire.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../commentaire.test-samples';

import { CommentaireService } from './commentaire.service';

const requireRestSample: ICommentaire = {
  ...sampleWithRequiredData,
};

describe('Commentaire Service', () => {
  let service: CommentaireService;
  let httpMock: HttpTestingController;
  let expectedResult: ICommentaire | ICommentaire[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CommentaireService);
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

    it('should create a Commentaire', () => {
      const commentaire = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(commentaire).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Commentaire', () => {
      const commentaire = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(commentaire).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Commentaire', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Commentaire', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Commentaire', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCommentaireToCollectionIfMissing', () => {
      it('should add a Commentaire to an empty array', () => {
        const commentaire: ICommentaire = sampleWithRequiredData;
        expectedResult = service.addCommentaireToCollectionIfMissing([], commentaire);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(commentaire);
      });

      it('should not add a Commentaire to an array that contains it', () => {
        const commentaire: ICommentaire = sampleWithRequiredData;
        const commentaireCollection: ICommentaire[] = [
          {
            ...commentaire,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCommentaireToCollectionIfMissing(commentaireCollection, commentaire);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Commentaire to an array that doesn't contain it", () => {
        const commentaire: ICommentaire = sampleWithRequiredData;
        const commentaireCollection: ICommentaire[] = [sampleWithPartialData];
        expectedResult = service.addCommentaireToCollectionIfMissing(commentaireCollection, commentaire);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(commentaire);
      });

      it('should add only unique Commentaire to an array', () => {
        const commentaireArray: ICommentaire[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const commentaireCollection: ICommentaire[] = [sampleWithRequiredData];
        expectedResult = service.addCommentaireToCollectionIfMissing(commentaireCollection, ...commentaireArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const commentaire: ICommentaire = sampleWithRequiredData;
        const commentaire2: ICommentaire = sampleWithPartialData;
        expectedResult = service.addCommentaireToCollectionIfMissing([], commentaire, commentaire2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(commentaire);
        expect(expectedResult).toContain(commentaire2);
      });

      it('should accept null and undefined values', () => {
        const commentaire: ICommentaire = sampleWithRequiredData;
        expectedResult = service.addCommentaireToCollectionIfMissing([], null, commentaire, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(commentaire);
      });

      it('should return initial array if no Commentaire is added', () => {
        const commentaireCollection: ICommentaire[] = [sampleWithRequiredData];
        expectedResult = service.addCommentaireToCollectionIfMissing(commentaireCollection, undefined, null);
        expect(expectedResult).toEqual(commentaireCollection);
      });
    });

    describe('compareCommentaire', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCommentaire(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCommentaire(entity1, entity2);
        const compareResult2 = service.compareCommentaire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCommentaire(entity1, entity2);
        const compareResult2 = service.compareCommentaire(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCommentaire(entity1, entity2);
        const compareResult2 = service.compareCommentaire(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
