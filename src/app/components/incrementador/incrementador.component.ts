import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';



@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtPorcentaje') txtPorcentaje: ElementRef;
  @Input() leyenda: string = 'Leyenda';
  @Input() porcentaje: number = 50;
  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
   // console.log('Leyenda', this.leyenda);
   // console.log('Porcentaje', this.porcentaje);
   }

  ngOnInit() {
    // console.log('Leyenda2', this.leyenda);
  }

  onChanges( newValue: number) {

    // console.log( newValue );

    // let elemHTML: any = document.getElementsByName('porcentaje')[0];
    // console.log( elemHTML.value );

    if ( newValue >= 100) {
      this.porcentaje = 100;
    } else if ( newValue <= 0) {
      this.porcentaje = 0;
    } else {
      this.porcentaje = newValue;
    }

    // elemHTML.value =  this.porcentaje;
    this.txtPorcentaje.nativeElement.value = this.porcentaje;
    this.cambioValor.emit( this.porcentaje );
  }

  cambiarValor( valor: number ) {
    if (this.porcentaje >= 100) {
      this.porcentaje = 95;
    }
    if (this.porcentaje <= 0) {
      this.porcentaje = 5;
    }
    this.porcentaje = this.porcentaje + valor;

    this.cambioValor.emit( this.porcentaje );

    this.txtPorcentaje.nativeElement.focus();
  }

}
