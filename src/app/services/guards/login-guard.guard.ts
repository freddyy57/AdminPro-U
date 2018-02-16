import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class LoginGuardGuard implements CanActivate {

  constructor( public _usuarioService: UsuarioService,
               public router: Router) {}

  canActivate() {

    if ( this._usuarioService.estaLogueado() ) {
      console.log( 'PASÓ EL GUARD' );
      return true;
    } else {
      this.router.navigate(['/login']);
      console.log( 'Bloqueado por el Guard' );
      return false;
    }

  }
}
