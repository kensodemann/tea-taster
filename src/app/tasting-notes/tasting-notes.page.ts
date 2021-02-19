import { Component, OnInit } from '@angular/core';
import { TastingNote } from '@app/models';
import { selectNotes, State } from '@app/store';
import { noteDeleted, notesPageLoaded } from '@app/store/actions';
import { IonRouterOutlet, ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TastingNoteEditorComponent } from './tasting-note-editor/tasting-note-editor.component';

@Component({
  selector: 'app-tasting-notes',
  templateUrl: './tasting-notes.page.html',
  styleUrls: ['./tasting-notes.page.scss'],
})
export class TastingNotesPage implements OnInit {
  notes$: Observable<Array<TastingNote>>;
  isMobile: boolean;

  constructor(
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private store: Store<State>,
    private platform: Platform,
  ) {}

  ngOnInit() {
    this.isMobile = this.platform.is('capacitor');
    this.store.dispatch(notesPageLoaded());
    this.notes$ = this.store.select(selectNotes);
  }

  deleteNote(note: TastingNote): void {
    this.store.dispatch(noteDeleted({ note }));
  }

  async newNote(): Promise<void> {
    return this.displayEditor();
  }

  async updateNote(note: TastingNote): Promise<void> {
    return this.displayEditor(note);
  }

  private async displayEditor(note?: TastingNote): Promise<void> {
    const opt = {
      component: TastingNoteEditorComponent,
      backdropDismiss: false,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    };

    const modal = await (note
      ? this.modalController.create({ ...opt, componentProps: { note } })
      : this.modalController.create(opt));
    return modal.present();
  }
}
