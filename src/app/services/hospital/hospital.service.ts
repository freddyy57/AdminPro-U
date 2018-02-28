import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';

declare var swal: any;

@Injectable()
export class HospitalService {

  constructor(  public http: HttpClient,
                public _usuarioService: UsuarioService) { }

// ============================
// CREAR HOSPITAL
// ============================

  crearHospital ( nombre: string ) {
    console.log( 'Desde el servicio, ', nombre);
    let url = URL_SERVICIOS + '/hospital?token=' + this._usuarioService.token;
    return this.http.post(url, {nombre: nombre})
               .map((res: any) => {

                swal('Hecho!', 'El Hospital: ' + nombre + ' se creo con éxito',  'success');

                return res.hospital;
               });
  }

// ============================
// CARGAR HOSPITAL
// ============================

cargarHospitales( desde: number = 0) {

  let url = URL_SERVICIOS + '/hospital?desde=' + desde;

  return this.http.get( url );

}

// ============================
// BORRAR HOSPITAL
// ============================

borrarHospital( id: string ) {
  let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;
  return this.http.delete( url )
         .map( (res: any ) => {
           console.log('Borrado', res );
           swal('Hospital borrado', 'El Hospital:  ' + res.hospital.nombre + ' se ha eliminado correctamente', 'success');
           return true;
         });
}

// ============================
// BUSCAR HOSPITALES
// ============================

buscarHospitales( termino: string ) {
  let url = URL_SERVICIOS + '/busqueda/coleccion/Hospital/' + termino;
  return this.http.get( url )
    .map( ( res: any ) => res.Hospital );
}

// ============================
// ACTUALIZAR HOSPITAL
// ============================

actualizarHospital( hospital: Hospital ) {
  let url = URL_SERVICIOS + '/hospital/' + hospital._id;
  url += '?token=' + this._usuarioService.token;
  // console.log( url );

  return this.http.put( url, hospital )
        .map( (res: any) => {
          // this.usuario = res.usuario;

          swal('Usuario Actualizado', hospital.nombre, 'success');

          return true;

        });

}

// ============================
// OBTENER HOSPITAL POR ID
// ============================

obtenerHospital(id: string) {

  let url = URL_SERVICIOS + '/hospital/' + id;

  return this.http.get( url )
        .map( (res: any ) => res.hospital );
}

}
