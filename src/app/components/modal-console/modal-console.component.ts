import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Console } from 'src/app/models/console.model';

@Component({
  selector: 'app-modal-console',
  templateUrl: './modal-console.component.html',
  styleUrls: ['./modal-console.component.scss']
})
export class ModalConsoleComponent implements OnInit {

  @Input() consSel!: Console;

  constructor() { }

  ngOnInit(): void {}


  cerrarModal() {
  }


}
