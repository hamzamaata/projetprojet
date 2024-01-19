import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVoyageur } from '../voyageur.model';
import { VoyageurService } from '../service/voyageur.service';
import { VoyageurFormService, VoyageurFormGroup } from './voyageur-form.service';

@Component({
  standalone: true,
  selector: 'jhi-voyageur-update',
  templateUrl: './voyageur-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VoyageurUpdateComponent implements OnInit {
  isSaving = false;
  voyageur: IVoyageur | null = null;

  editForm: VoyageurFormGroup = this.voyageurFormService.createVoyageurFormGroup();

  constructor(
    protected voyageurService: VoyageurService,
    protected voyageurFormService: VoyageurFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ voyageur }) => {
      this.voyageur = voyageur;
      if (voyageur) {
        this.updateForm(voyageur);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const voyageur = this.voyageurFormService.getVoyageur(this.editForm);
    if (voyageur.id !== null) {
      this.subscribeToSaveResponse(this.voyageurService.update(voyageur));
    } else {
      this.subscribeToSaveResponse(this.voyageurService.create(voyageur));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVoyageur>>): void {
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

  protected updateForm(voyageur: IVoyageur): void {
    this.voyageur = voyageur;
    this.voyageurFormService.resetForm(this.editForm, voyageur);
  }
}
