import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommentaire, NewCommentaire } from '../commentaire.model';

export type PartialUpdateCommentaire = Partial<ICommentaire> & Pick<ICommentaire, 'id'>;

export type EntityResponseType = HttpResponse<ICommentaire>;
export type EntityArrayResponseType = HttpResponse<ICommentaire[]>;

@Injectable({ providedIn: 'root' })
export class CommentaireService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/commentaires');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(commentaire: NewCommentaire): Observable<EntityResponseType> {
    return this.http.post<ICommentaire>(this.resourceUrl, commentaire, { observe: 'response' });
  }

  update(commentaire: ICommentaire): Observable<EntityResponseType> {
    return this.http.put<ICommentaire>(`${this.resourceUrl}/${this.getCommentaireIdentifier(commentaire)}`, commentaire, {
      observe: 'response',
    });
  }

  partialUpdate(commentaire: PartialUpdateCommentaire): Observable<EntityResponseType> {
    return this.http.patch<ICommentaire>(`${this.resourceUrl}/${this.getCommentaireIdentifier(commentaire)}`, commentaire, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICommentaire>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICommentaire[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCommentaireIdentifier(commentaire: Pick<ICommentaire, 'id'>): number {
    return commentaire.id;
  }

  compareCommentaire(o1: Pick<ICommentaire, 'id'> | null, o2: Pick<ICommentaire, 'id'> | null): boolean {
    return o1 && o2 ? this.getCommentaireIdentifier(o1) === this.getCommentaireIdentifier(o2) : o1 === o2;
  }

  addCommentaireToCollectionIfMissing<Type extends Pick<ICommentaire, 'id'>>(
    commentaireCollection: Type[],
    ...commentairesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const commentaires: Type[] = commentairesToCheck.filter(isPresent);
    if (commentaires.length > 0) {
      const commentaireCollectionIdentifiers = commentaireCollection.map(
        commentaireItem => this.getCommentaireIdentifier(commentaireItem)!,
      );
      const commentairesToAdd = commentaires.filter(commentaireItem => {
        const commentaireIdentifier = this.getCommentaireIdentifier(commentaireItem);
        if (commentaireCollectionIdentifiers.includes(commentaireIdentifier)) {
          return false;
        }
        commentaireCollectionIdentifiers.push(commentaireIdentifier);
        return true;
      });
      return [...commentairesToAdd, ...commentaireCollection];
    }
    return commentaireCollection;
  }
}
