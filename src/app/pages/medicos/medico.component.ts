import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService, HospitalService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor( public _medicoService: MedicoService,
               public _hospitalService: HospitalService,
               public _router: Router,
               public activatedRoute: ActivatedRoute,
               public _modalUploadService: ModalUploadService) {

                 this.activatedRoute.params.subscribe( params => {
                   let id = params['id'];

                   if ( id !== 'nuevo' ) {
                     this.cargarMedico( id );
                   }
                 });
                }

  ngOnInit() {

    this._hospitalService.cargarHospitales(  )
        . subscribe( (res: any) => {
         // console.log( res );
          this.hospitales = res.hospitales;
        });

    // suscribirse y cuando suba imagen recargar usuarios
    this._modalUploadService.notificacion
    .subscribe( res => {

      this.medico.img = res.medico.img;

    });
  }

// ============================
// MOSTRAR MODAL
// ============================
mostrarModal( id: string ) {
  this._modalUploadService.mostrarModal('medicos', id);
}

// ============================
// CREAR MEDICO
// ============================

  guardarMedico( f: NgForm ) {
    // console.log( f.valid );
    // console.log( f.value );
    if ( f.invalid ) {
      return;
    }
    this._medicoService.guardarMedico( this.medico )
                  .subscribe( medico => {
                    // console.log( medico );
                    this.medico._id = medico._id;
                    this._router.navigate(['/medico', medico._id ]);
                  });
  }

// ============================
// CAMBIO HOSPITAL(SELECT)
// ============================

  cambioHospital( id: string ) {
     // console.log( id );
     this._hospitalService.obtenerHospital( id )
             .subscribe( hospital => {
               // console.log(hospital);
               this.hospital = hospital;
             });
  }

// ============================
// CARGAR MEDICO (ID)
// ============================

cargarMedico( id: string ) {
  this._medicoService.cargarMedico( id )
       .subscribe( medico => {
         this.medico = medico;
         this.medico.hospital = medico.hospital._id;
         this.cambioHospital( this.medico.hospital);
       });
}



}
