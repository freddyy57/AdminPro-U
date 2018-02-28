import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
// import { HospitalService } from '../../services/hospital/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { HospitalService, UsuarioService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  // hospital: Hospital;

  desde: number = 0;

  cargando: boolean = true;
  totalregistros: number = 0;

  constructor( public _hospitalService: HospitalService,
               public _modalUploadService: ModalUploadService,
               public _usuarioService: UsuarioService ) { }

  ngOnInit() {
    this.CargarHospitales();
    // suscribirse y cuando suba imagen recargar usuarios
    this._modalUploadService.notificacion
        .subscribe( res => this.CargarHospitales() );
  }

// ============================
// MOSTRAR MODAL
// ============================
  mostrarModal( id: string ) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

// ============================
// CREAR HOSPITAL
// ============================

  CrearHospital(nombre: string ) {

    swal({
      title: 'Crear un Hospital',
      text: 'Escriba el nombre del Hospital',
      content: 'input',
      buttons: true,
      dangerMode: true
    })
    .then ( (name: string) => {
       // console.log( hospital );
       if (!name || name.length <= 0) {
        swal('Oops!', 'No se ha creado un Hospital nuevo', 'error');
       }
       if (name.length <= 2) {
        swal('Oops!', 'El nombre del hospital debe tener al menos 3 caracteres', 'error');
       }
       if ( name) {
         console.log( name );
         // name = hospital;
         this._hospitalService.crearHospital( name )
         .subscribe ( res => {
          console.log( res );
         // this.cargarUsuarios();
         this.CargarHospitales();
        });

       }

    })
    .catch(err => {
      swal('Oops!', 'Parece que no hay ningún nombre escrito', 'error');

  });
}

// ============================
// CARGAR HOSPITAL
// ============================

CargarHospitales () {

  this.cargando = true;

    this._hospitalService.cargarHospitales( this.desde )
        . subscribe( (res: any) => {
          console.log( res );
          this.totalregistros = res.total;
          this.hospitales = res.hospitales;
          this.cargando = false;
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
  this.CargarHospitales();
}


// ============================
// BORRAR HOSPITAL
// ============================
borrarHospital( hospital: Hospital ) {
  // console.log ( usuario );
  // if ( usuario._id === this._usuarioService.usuario._id ) {
  //   swal ( 'No se puede borrar usuario', 'No se puede borrar a si mismo', 'error');
  //   return;
  // }

  swal({
    title: '¿está seguro?',
    text: 'Está a punto de borrar a ' + hospital.nombre,
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  })
  .then(borrar => {
    // console.log( borrar );
    if ( borrar ) {
      this._hospitalService.borrarHospital( hospital._id)
          .subscribe ( res => {
            console.log( res );
            this.CargarHospitales();
          });
    }
  });
 }
// ============================
// BUSCAR HOSPITAL
// ============================
 buscarHospital( termino: string ) {
// console.log( termino );

if ( termino.length <= 0 ) {
  this.CargarHospitales();
  return;
}

this.cargando = true;

this._hospitalService.buscarHospitales( termino )
   .subscribe( (hospitales: Hospital[]) => {
     // console.log( hospitales );
     this.hospitales = hospitales;

     this.cargando = false;
   });
}

// ============================
// GUARDAR HOSPITAL
// ============================

guardarHospital( hospital: Hospital ) {
  this._hospitalService.actualizarHospital( hospital )
      .subscribe();
}





}
