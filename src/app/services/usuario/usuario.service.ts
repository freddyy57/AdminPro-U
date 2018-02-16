import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';


declare var swal: any;


@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient,
               public router: Router) {

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
  } else {
    this.token = '';
    this.usuario = null;
  }

}


guardarStorage( id: string, token: string, usuario: Usuario) {

  localStorage.setItem('id', id );
  localStorage.setItem('token', token );
  localStorage.setItem('usuario', JSON.stringify( usuario ));

  this.usuario = usuario;
  this.token = token;

}


// ============================
// LOGOUT
// ============================
logout() {

  this.usuario = null;
  this.token = '';

  localStorage.removeItem('token');
  localStorage.removeItem('usuario');

  this.router.navigate(['/login']);

}

// ============================
// LOGIN GOOGLE
// ============================

  loginGoogle ( token: string) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token })
           .map( (res: any ) => {
             this.guardarStorage(res.id, res.token, res.usuario);
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
                this.guardarStorage(res.id, res.token, res.usuario);

                // localStorage.setItem('id', res.id );
                // localStorage.setItem('token', res.token );
                // localStorage.setItem('usuario', JSON.stringify(res.usuario) );

                return true;
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

             });

  }

}
