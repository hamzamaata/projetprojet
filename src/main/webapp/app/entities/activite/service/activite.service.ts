import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActivite, NewActivite } from '../activite.model';

export type PartialUpdateActivite = Partial<IActivite> & Pick<IActivite, 'id'>;

export type EntityResponseType = HttpResponse<IActivite>;
export type EntityArrayResponseType = HttpResponse<IActivite[]>;

@Injectable({ providedIn: 'root' })
export class ActiviteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/activites');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(activite: NewActivite): Observable<EntityResponseType> {
    return this.http.post<IActivite>(this.resourceUrl, activite, { observe: 'response' });
  }

  update(activite: IActivite): Observable<EntityResponseType> {
    return this.http.put<IActivite>(`${this.resourceUrl}/${this.getActiviteIdentifier(activite)}`, activite, { observe: 'response' });
  }

  partialUpdate(activite: PartialUpdateActivite): Observable<EntityResponseType> {
    return this.http.patch<IActivite>(`${this.resourceUrl}/${this.getActiviteIdentifier(activite)}`, activite, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActivite>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActivite[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActiviteIdentifier(activite: Pick<IActivite, 'id'>): number {
    return activite.id;
  }

  compareActivite(o1: Pick<IActivite, 'id'> | null, o2: Pick<IActivite, 'id'> | null): boolean {
    return o1 && o2 ? this.getActiviteIdentifier(o1) === this.getActiviteIdentifier(o2) : o1 === o2;
  }

  addActiviteToCollectionIfMissing<Type extends Pick<IActivite, 'id'>>(
    activiteCollection: Type[],
    ...activitesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const activites: Type[] = activitesToCheck.filter(isPresent);
    if (activites.length > 0) {
      const activiteCollectionIdentifiers = activiteCollection.map(activiteItem => this.getActiviteIdentifier(activiteItem)!);
      const activitesToAdd = activites.filter(activiteItem => {
        const activiteIdentifier = this.getActiviteIdentifier(activiteItem);
        if (activiteCollectionIdentifiers.includes(activiteIdentifier)) {
          return false;
        }
        activiteCollectionIdentifiers.push(activiteIdentifier);
        return true;
      });
      return [...activitesToAdd, ...activiteCollection];
    }
    return activiteCollection;
  }
}
