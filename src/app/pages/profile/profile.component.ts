import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
// import * as swal from 'sweetalert';
declare var swal: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;

  imagenSubir: File;
  imagenTemp: string;

  constructor( public _usuarioService: UsuarioService) {
    this.usuario = this._usuarioService.usuario;
   }

  ngOnInit() {
  }

  guardar ( usuario: Usuario ) {
    // console.log( usuario );
    this.usuario.nombre = usuario.nombre;

    if ( !this.usuario.google ) {
    this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario( this.usuario )
              .subscribe( res => {
                // console.log( res );
              });
  }

  seleccionImagen( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
      swal(' Sólo Imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    // console.log( archivo );

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onload = () => this.imagenTemp = reader.result;
  }

  cambiarImagen() {
    this._usuarioService.cambiarImagen( this.imagenSubir, this.usuario._id );
  }

}
