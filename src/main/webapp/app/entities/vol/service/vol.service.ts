import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVol, NewVol } from '../vol.model';

export type PartialUpdateVol = Partial<IVol> & Pick<IVol, 'id'>;

export type EntityResponseType = HttpResponse<IVol>;
export type EntityArrayResponseType = HttpResponse<IVol[]>;

@Injectable({ providedIn: 'root' })
export class VolService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vols');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(vol: NewVol): Observable<EntityResponseType> {
    return this.http.post<IVol>(this.resourceUrl, vol, { observe: 'response' });
  }

  update(vol: IVol): Observable<EntityResponseType> {
    return this.http.put<IVol>(`${this.resourceUrl}/${this.getVolIdentifier(vol)}`, vol, { observe: 'response' });
  }

  partialUpdate(vol: PartialUpdateVol): Observable<EntityResponseType> {
    return this.http.patch<IVol>(`${this.resourceUrl}/${this.getVolIdentifier(vol)}`, vol, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVol>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVol[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVolIdentifier(vol: Pick<IVol, 'id'>): number {
    return vol.id;
  }

  compareVol(o1: Pick<IVol, 'id'> | null, o2: Pick<IVol, 'id'> | null): boolean {
    return o1 && o2 ? this.getVolIdentifier(o1) === this.getVolIdentifier(o2) : o1 === o2;
  }

  addVolToCollectionIfMissing<Type extends Pick<IVol, 'id'>>(volCollection: Type[], ...volsToCheck: (Type | null | undefined)[]): Type[] {
    const vols: Type[] = volsToCheck.filter(isPresent);
    if (vols.length > 0) {
      const volCollectionIdentifiers = volCollection.map(volItem => this.getVolIdentifier(volItem)!);
      const volsToAdd = vols.filter(volItem => {
        const volIdentifier = this.getVolIdentifier(volItem);
        if (volCollectionIdentifiers.includes(volIdentifier)) {
          return false;
        }
        volCollectionIdentifiers.push(volIdentifier);
        return true;
      });
      return [...volsToAdd, ...volCollection];
    }
    return volCollection;
  }
}
