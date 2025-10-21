import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-pago',
  templateUrl: './modal-pago.component.html',
  styleUrls: ['./modal-pago.component.css']
})
export class ModalPagoComponent implements OnInit, AfterViewInit {
  @ViewChild('iframe') iframe!: ElementRef;
  safeUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ModalPagoComponent>
  ) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.iframe.nativeElement.onload = () => {
      setTimeout(() => {
        try {
          const iframeDocument = this.iframe.nativeElement.contentDocument;
          const contentWidth = iframeDocument.body.scrollWidth;
          const contentHeight = iframeDocument.body.scrollHeight;
          const maxWidth = Math.min(contentWidth + 40, window.innerWidth * 0.95);
          const maxHeight = Math.min(contentHeight + 40, window.innerHeight * 0.95);

          this.dialogRef.updateSize(`${maxWidth}px`, `${maxHeight}px`);

        } catch (e) {
          this.dialogRef.updateSize('600px', '700px');
        }
      }, 500);
    };
  }
}
