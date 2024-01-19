import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IActivite } from '../activite.model';
import { ActiviteService } from '../service/activite.service';

@Component({
  standalone: true,
  templateUrl: './activite-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ActiviteDeleteDialogComponent {
  activite?: IActivite;

  constructor(
    protected activiteService: ActiviteService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activiteService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
