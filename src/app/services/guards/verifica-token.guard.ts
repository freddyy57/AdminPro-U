import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class VerificaTokenGuard implements CanActivate {

  constructor( public _usuarioService: UsuarioService,
               public router: Router) {

  }
  canActivate(): Promise<boolean> | boolean {
    console.log('Inicio de verifica token guard');
    let token = this._usuarioService.token;
    let payload = JSON.parse( atob( token.split('.')[1]));

    let expirado = this.expirado( payload.exp );
    if ( expirado ) {
      // sacarlo
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificRaenueva( payload.exp );
  }

  verificRaenueva( fechaExp: number ): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      let tokenExp = new Date( fechaExp * 1000 );
      let ahora = new Date();
      ahora.setTime( ahora.getTime() + (1 * 60 * 60 * 1000) );
      // console.log( tokenExp );
      // console.log( ahora );
      // Si la fecha de expiración del token es mayor a 4 horas
      // no hagas nada
      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {
        // si la fecha es menor a la estipulada
        // actualiza el token
        this._usuarioService.renuevaToken()
            .subscribe( () => {
              resolve(true);
            }, () => {
              // si el token no es válido
              // saca al usuario
              reject(false);
              this.router.navigate(['/login']);
            });
      }

      resolve( true );
    });
  }

  expirado( fechaExp: number ) {
    // Obtener momento actual en segundos
    let ahora = new Date().getTime() / 1000;
    // Si la fecha de expiración es menor al momento actual
    // tiken no valido
    if ( fechaExp < ahora ) {
      return true;
    } else {
      // no ha expirado el token
      return false;
    }
  }
}
