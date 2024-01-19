import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVoyageur, NewVoyageur } from '../voyageur.model';

export type PartialUpdateVoyageur = Partial<IVoyageur> & Pick<IVoyageur, 'id'>;

export type EntityResponseType = HttpResponse<IVoyageur>;
export type EntityArrayResponseType = HttpResponse<IVoyageur[]>;

@Injectable({ providedIn: 'root' })
export class VoyageurService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/voyageurs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(voyageur: NewVoyageur): Observable<EntityResponseType> {
    return this.http.post<IVoyageur>(this.resourceUrl, voyageur, { observe: 'response' });
  }

  update(voyageur: IVoyageur): Observable<EntityResponseType> {
    return this.http.put<IVoyageur>(`${this.resourceUrl}/${this.getVoyageurIdentifier(voyageur)}`, voyageur, { observe: 'response' });
  }

  partialUpdate(voyageur: PartialUpdateVoyageur): Observable<EntityResponseType> {
    return this.http.patch<IVoyageur>(`${this.resourceUrl}/${this.getVoyageurIdentifier(voyageur)}`, voyageur, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVoyageur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVoyageur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVoyageurIdentifier(voyageur: Pick<IVoyageur, 'id'>): number {
    return voyageur.id;
  }

  compareVoyageur(o1: Pick<IVoyageur, 'id'> | null, o2: Pick<IVoyageur, 'id'> | null): boolean {
    return o1 && o2 ? this.getVoyageurIdentifier(o1) === this.getVoyageurIdentifier(o2) : o1 === o2;
  }

  addVoyageurToCollectionIfMissing<Type extends Pick<IVoyageur, 'id'>>(
    voyageurCollection: Type[],
    ...voyageursToCheck: (Type | null | undefined)[]
  ): Type[] {
    const voyageurs: Type[] = voyageursToCheck.filter(isPresent);
    if (voyageurs.length > 0) {
      const voyageurCollectionIdentifiers = voyageurCollection.map(voyageurItem => this.getVoyageurIdentifier(voyageurItem)!);
      const voyageursToAdd = voyageurs.filter(voyageurItem => {
        const voyageurIdentifier = this.getVoyageurIdentifier(voyageurItem);
        if (voyageurCollectionIdentifiers.includes(voyageurIdentifier)) {
          return false;
        }
        voyageurCollectionIdentifiers.push(voyageurIdentifier);
        return true;
      });
      return [...voyageursToAdd, ...voyageurCollection];
    }
    return voyageurCollection;
  }
}
