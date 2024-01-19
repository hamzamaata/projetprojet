import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVol } from '../vol.model';
import { VolService } from '../service/vol.service';
import { VolFormService, VolFormGroup } from './vol-form.service';

@Component({
  standalone: true,
  selector: 'jhi-vol-update',
  templateUrl: './vol-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VolUpdateComponent implements OnInit {
  isSaving = false;
  vol: IVol | null = null;

  editForm: VolFormGroup = this.volFormService.createVolFormGroup();

  constructor(
    protected volService: VolService,
    protected volFormService: VolFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vol }) => {
      this.vol = vol;
      if (vol) {
        this.updateForm(vol);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vol = this.volFormService.getVol(this.editForm);
    if (vol.id !== null) {
      this.subscribeToSaveResponse(this.volService.update(vol));
    } else {
      this.subscribeToSaveResponse(this.volService.create(vol));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVol>>): void {
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

  protected updateForm(vol: IVol): void {
    this.vol = vol;
    this.volFormService.resetForm(this.editForm, vol);
  }
}
