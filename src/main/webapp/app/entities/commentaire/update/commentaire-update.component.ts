import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IReservation } from 'app/entities/reservation/reservation.model';
import { ReservationService } from 'app/entities/reservation/service/reservation.service';
import { ICommentaire } from '../commentaire.model';
import { CommentaireService } from '../service/commentaire.service';
import { CommentaireFormService, CommentaireFormGroup } from './commentaire-form.service';

@Component({
  standalone: true,
  selector: 'jhi-commentaire-update',
  templateUrl: './commentaire-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CommentaireUpdateComponent implements OnInit {
  isSaving = false;
  commentaire: ICommentaire | null = null;

  reservationsSharedCollection: IReservation[] = [];

  editForm: CommentaireFormGroup = this.commentaireFormService.createCommentaireFormGroup();

  constructor(
    protected commentaireService: CommentaireService,
    protected commentaireFormService: CommentaireFormService,
    protected reservationService: ReservationService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareReservation = (o1: IReservation | null, o2: IReservation | null): boolean => this.reservationService.compareReservation(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commentaire }) => {
      this.commentaire = commentaire;
      if (commentaire) {
        this.updateForm(commentaire);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commentaire = this.commentaireFormService.getCommentaire(this.editForm);
    if (commentaire.id !== null) {
      this.subscribeToSaveResponse(this.commentaireService.update(commentaire));
    } else {
      this.subscribeToSaveResponse(this.commentaireService.create(commentaire));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommentaire>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(commentaire: ICommentaire): void {
    this.commentaire = commentaire;
    this.commentaireFormService.resetForm(this.editForm, commentaire);

    this.reservationsSharedCollection = this.reservationService.addReservationToCollectionIfMissing<IReservation>(
      this.reservationsSharedCollection,
      commentaire.reservation,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.reservationService
      .query()
      .pipe(map((res: HttpResponse<IReservation[]>) => res.body ?? []))
      .pipe(
        map((reservations: IReservation[]) =>
          this.reservationService.addReservationToCollectionIfMissing<IReservation>(reservations, this.commentaire?.reservation),
        ),
      )
      .subscribe((reservations: IReservation[]) => (this.reservationsSharedCollection = reservations));
  }
}
