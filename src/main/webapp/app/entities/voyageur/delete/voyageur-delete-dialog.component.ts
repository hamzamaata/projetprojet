import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVoyageur } from '../voyageur.model';
import { VoyageurService } from '../service/voyageur.service';

@Component({
  standalone: true,
  templateUrl: './voyageur-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VoyageurDeleteDialogComponent {
  voyageur?: IVoyageur;

  constructor(
    protected voyageurService: VoyageurService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.voyageurService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
