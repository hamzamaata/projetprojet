import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICommentaire } from '../commentaire.model';
import { CommentaireService } from '../service/commentaire.service';

@Component({
  standalone: true,
  templateUrl: './commentaire-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CommentaireDeleteDialogComponent {
  commentaire?: ICommentaire;

  constructor(
    protected commentaireService: CommentaireService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.commentaireService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
