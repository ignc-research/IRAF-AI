import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AceEditorComponent } from './components/ace-editor/ace-editor.component';



@NgModule({
  declarations: [
    AceEditorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AceEditorComponent
  ]
})
export class SharedModule { }
