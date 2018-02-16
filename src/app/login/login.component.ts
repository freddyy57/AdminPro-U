import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

// Para usar los plugins de javascript
declare function init_plugins();
// Para usar Google SignIn
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;

  auth2: any;

  constructor( public router: Router,
               public _usuarioService: UsuarioService ) { }

  ngOnInit() {

    // ===================
    // Inicializa Plugins .js
    // ======================
    init_plugins();
    // =======================================
    // Grabar email del LocalStorage, si no encuentra el valor
    // poner caracter vacío
    // =======================================
    this.email = localStorage.getItem('email') || '';
    // Poner el check del formulario en recuerdame
    if ( this.email.length > 1) {
      this.recuerdame = true;
    }

    // google
    this.googleInit();
  }

   googleInit() {
     gapi.load('auth2', () => {

       this.auth2 = gapi.auth2.init({
         client_id: '763286748051-ndscn8qq1cpqqq88k09i0skailt9fcjo.apps.googleusercontent.com',
         cookiepolicy: 'single_host_origin',
         scope: 'profile email'
       });
       this.attachSignin( document.getElementById('btnGoogle'));
     });
   }

  attachSignin ( element) {

    this.auth2.attachClickHandler( element, {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile();
      // console.log( profile );
      let token = googleUser.getAuthResponse().id_token;

      this._usuarioService.loginGoogle( token )
            .subscribe( res => {
              // this.router.navigate(['/dashboard']);
              window.location.href = '#/dashboard';
              console.log( res );
            });

      // console.log( token );

    });
  }

  ingresar( forma: NgForm) {

    if ( forma.invalid ) {
      return;
    }

    let usuario = new Usuario(null, forma.value.email, forma.value.password );

    /*this._usuarioService.login( usuario, forma.value.recuerdame )
              .subscribe( resp => {
                console.log(resp);
              }); */

      this._usuarioService.login( usuario, forma.value.recuerdame )
             .subscribe( loginCorrecto => this.router.navigate(['/dashboard']));

    // console.log( forma.valid );
    // console.log( forma.value );

   // this.router.navigate(['/dashboard']);
  }

}
