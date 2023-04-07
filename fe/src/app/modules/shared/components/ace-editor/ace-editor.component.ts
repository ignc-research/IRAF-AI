import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as ace from "ace-builds";


@Component({
  selector: 'app-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.scss']
})
export class AceEditorComponent implements AfterViewInit {
  private _mode = '';
  private _content: string | null = null;

  @ViewChild("editor") private editor!: ElementRef<HTMLElement>;

  aceEditor!: ace.Ace.Editor;

  @Input()
  autoscroll = false;

  @Input()
  readonly = false;

  @Input()
  set editorContent(val: string | null) {
    this._content = val;

    this.aceEditor?.session.setValue(this._content ?? '');

    if (this.autoscroll) {
      this.aceEditor?.renderer.scrollToLine(Number.POSITIVE_INFINITY, false, false, () => null)
    }
  }

  get editorContent() {
    return this.aceEditor?.session.getValue();
  }

  @Output()
  editorContentChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  @Input()
  set mode(val: string) {
    this._mode = val;
    this.aceEditor?.session.setMode(val);
  }

  get mode() {
    return this._mode;
  }

  ngAfterViewInit(): void {
    ace.config.set("fontSize", "16px");
    this.aceEditor = ace.edit(this.editor.nativeElement);
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.16.0/src-noconflict');

    this.aceEditor.setTheme('ace/theme/twilight');
    this.aceEditor.session.setMode(this._mode);
    this.aceEditor.setValue(this._content ?? '');
    this.aceEditor.setReadOnly(this.readonly);
    this.aceEditor.on('change', () => this.editorContentChange.emit(this.editorContent));
    this.editorContent = null;
  }
}
