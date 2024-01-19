import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVol } from '../vol.model';
import { VolService } from '../service/vol.service';

@Component({
  standalone: true,
  templateUrl: './vol-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VolDeleteDialogComponent {
  vol?: IVol;

  constructor(
    protected volService: VolService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.volService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
