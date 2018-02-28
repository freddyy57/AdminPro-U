import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

declare var swal: any;

@Injectable()
export class MedicoService {

  constructor( public _http: HttpClient,
               public _usuarioService: UsuarioService) { }

// ============================
// CARGAR MEDICOS
// ============================

  cargarMedicos( desde: number = 0 ) {
    let url = URL_SERVICIOS + '/medico?desde=' + desde;

    return this._http.get(url);
  }

// ============================
// BUSCAR MEDICO
// ============================

buscarMedicos( termino: string ) {
  let url = URL_SERVICIOS + '/busqueda/coleccion/medico/' + termino;
  return this._http.get( url )
    .map( ( res: any ) => res.medico );
}

// ============================
// BORRAR MEDICO
// ============================

borrarMedico( id: string ) {
  let url = URL_SERVICIOS + '/medico/' + id + '?token=' + this._usuarioService.token;
  return this._http.delete( url )
         .map( (res: any ) => {
           // console.log('Borrado', res );
           swal('Médico borrado', 'El Médico:  ' + res.medico.nombre + ' se ha eliminado correctamente', 'success');
           return true;
         });
}

// ============================
// CREAR/ACTUALIZAR MEDICO
// ============================

guardarMedico( medico: Medico) {

  let url = URL_SERVICIOS + '/medico';

  if ( medico._id ) {
    // Actualiza
    url += '/' + medico._id + '?token=' + this._usuarioService.token;
    return this._http.put( url, medico)
            .map( (res: any) => {
              swal('Médico Actualizado', medico.nombre, 'success');
              return res.medico;
            });
  } else {
    // creando
    url += '?token=' +  this._usuarioService.token;
    return this._http.post( url, medico )
           .map( (res: any) => {
             swal('Médico Creado', medico.nombre, 'success');
             return res.medico;
           });
  }

}

// ============================
// CARGAR MEDICO POR ID
// ============================
cargarMedico( id: string ) {
  let url = URL_SERVICIOS + '/medico/' + id;
  return this._http.get( url )
       .map( (res: any) => res.medico );
}

}
