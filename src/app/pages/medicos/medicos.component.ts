import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  cargando: boolean = true;
  totalregistros: number = 0;
  desde: number = 0;

  constructor( public _medicoServices: MedicoService,
               public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarMedicos();
    // suscribirse y cuando suba imagen recargar usuarios
    this._modalUploadService.notificacion
        .subscribe( res => this.cargarMedicos() );
  }

// ============================
// MOSTRAR MODAL
// ============================
mostrarModal( id: string ) {
  this._modalUploadService.mostrarModal('medicos', id);
}

// ============================
// CARGAR MEDICOS
// ============================
cargarMedicos() {
  this.cargando = true;
  this._medicoServices.cargarMedicos( this.desde )
        . subscribe( (res: any) => {
          console.log( res );
          this.totalregistros = res.total;
          this.medicos = res.medicos;
          this.cargando = false;
        });
}

// ============================
// BUSCAR MEDICO(S)
// ============================
buscarMedico( termino: string ) {
  // console.log( termino );

  if ( termino.length <= 0 ) {
    this.cargarMedicos();
    return;
  }

  this.cargando = true;

  this._medicoServices.buscarMedicos( termino )
     .subscribe( (hospitales: Medico[]) => {
       // console.log( hospitales );
       this.medicos = hospitales;

       this.cargando = false;
     });
  }

// ============================
// BORRAR MEDICO
// ============================
borrarMedico( medico: Medico ) {

  swal({
    title: '¿está seguro?',
    text: 'Está a punto de borrar a ' + medico.nombre,
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  })
  .then(borrar => {
    // console.log( borrar );
    if ( borrar ) {
      this._medicoServices.borrarMedico( medico._id)
          .subscribe ( res => {
            // console.log( res );
            this.cargarMedicos();
          });
    }
  });
 }


// ============================
// CAMBIAR DESDE
// ============================

cambiarDesde( valor: number ) {
  let desde = this.desde + valor;
  console.log( desde );

  if ( desde >= this.totalregistros ) {
    return;
  }
  if ( desde < 0) {
    return;
  }

  this.desde += valor;
  this.cargarMedicos();
}

}
