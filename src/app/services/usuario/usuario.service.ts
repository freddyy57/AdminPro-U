import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable } from 'rxjs/Observable';


declare var swal: any;


@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor( public http: HttpClient,
               public router: Router,
              public _subirArchivoService: SubirArchivoService) {

    // console.log('Servicio de Usuario Listo');
    this.cargarStorage();

  }

// ============================
// SEGURIDAD PARA PÁGINAS CON TOKEN
// ============================

estaLogueado() {
 return ( this.token.length > 5) ? true : false;
}

// ==============================
// GUARDAR - CARGAR LOCAL STORAGE
// ==============================
cargarStorage() {

  if ( localStorage.getItem('token')) {
    this.token = localStorage.getItem('token');
    this.usuario = JSON.parse( localStorage.getItem('usuario') );
    this.menu = JSON.parse( localStorage.getItem('menu') );
  } else {
    this.token = '';
    this.usuario = null;
    this.menu = [];
  }

}


guardarStorage( id: string, token: string, usuario: Usuario, menu: any) {

  localStorage.setItem('id', id );
  localStorage.setItem('token', token );
  localStorage.setItem('usuario', JSON.stringify( usuario ));
  localStorage.setItem('menu', JSON.stringify( menu ));

  this.usuario = usuario;
  this.token = token;
  this.menu = menu;

}


// ============================
// LOGOUT
// ============================
logout() {

  this.usuario = null;
  this.token = '';

  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('menu');

  this.router.navigate(['/login']);

}

// ============================
// LOGIN GOOGLE
// ============================

  loginGoogle ( token: string) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token })
           .map( (res: any ) => {
             this.guardarStorage(res.id, res.token, res.usuario, res.menu);
              console.log( 'Usuario service', res);
             return true;
           });

  }

// ============================
// LOGIN NORMAL
// ============================

  login( usuario: Usuario, recuerdame: boolean = false ) {

    if ( recuerdame ) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario )
              .map( (res: any) => {
                // Guardar en el local storage
                this.guardarStorage(res.id, res.token, res.usuario, res.menu);

                // localStorage.setItem('id', res.id );
                // localStorage.setItem('token', res.token );
                // localStorage.setItem('usuario', JSON.stringify(res.usuario) );

                return true;
              })
              .catch( err => {

                swal('ERROR', err.error.mensaje, 'error' );
                return Observable.throw( err );
              });

  }

// ============================
// CREAR USUARIO
// ============================

  crearUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
             .map( ( res: any ) => {

              swal('Su cuenta de Usuario se creo con éxito', usuario.email, 'success');

              return res.usuario;

             })
             .catch( err => {

              swal(err.error.mensaje, err.error.errors.message, 'error' );
              return Observable.throw( err );
            });

  }

// ============================
// ACTUALIZAR USUARIO
// ============================

actualizarUsuario( usuario: Usuario ) {
  let url = URL_SERVICIOS + '/usuario/' + usuario._id;
  url += '?token=' + this.token;
  // console.log( url );

  return this.http.put( url, usuario )
        .map( (res: any) => {
          // this.usuario = res.usuario;
          if ( usuario._id === this.usuario._id) {
            let usuarioDB: Usuario = res.usuario;
            this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu );
          }

          swal('Usuario Actualizado', usuario.nombre, 'success');

          return true;

        })
        .catch( err => {

          swal(err.error.mensaje, err.error.errors.message, 'error' );
          return Observable.throw( err );
        });

}

// ============================
// CAMBIAR IMAGEN
// ============================

cambiarImagen( archivo: File, id: string ) {

  this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
     .then( (res: any) => {
     // console.log( res );
     this.usuario.img = res.usuario.img;
     swal('Imagen Actualizada', this.usuario.nombre, 'success');

     this.guardarStorage(id, this.token, this.usuario, this.menu );

     })
     .catch( res => {
       console.log( res );
     });
}

// ============================
// CARGAR USUARIOS
// ============================

cargarUsuarios( desde: number = 0) {

  let url = URL_SERVICIOS + '/usuario?desde=' + desde;

  return this.http.get( url );
}

// ============================
// BUSCAR USUARIOS
// ============================

buscarUsuarios( termino: string ) {
  let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
  return this.http.get( url )
    .map( ( res: any ) => res.usuarios );
}

// ============================
// BORRAR USUARIO
// ============================

borrarusuario( id: string ) {
  let url = URL_SERVICIOS + '/usuario/' + id + '?token=' + this.token;
  return this.http.delete( url )
         .map( (res: any ) => {
           console.log('Borrado', res );
           swal('Usuario borrado', 'El usuario ' + res.usuario.nombre + ' se ha eliminado correctamente', 'success');
           return true;
         });
}

}
