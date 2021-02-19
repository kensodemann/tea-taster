import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { IonicModule } from '@ionic/angular';
import { TastingNoteEditorComponent } from './tasting-note-editor.component';

@NgModule({
  declarations: [TastingNoteEditorComponent],
  exports: [TastingNoteEditorComponent],
  imports: [CommonModule, FormsModule, IonicModule, SharedModule],
})
export class TastingNoteEditorModule {}
