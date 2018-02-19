import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
// import * as swal from 'sweetalert';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  desde: number = 0;
  totalregistros: number = 0;
  cargando: boolean = true;

  constructor( public _usuarioService: UsuarioService,
               public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarUsuarios();
    // suscribirse y cuando suba imagen recargar usuarios
    this._modalUploadService.notificacion
        .subscribe( res => this.cargarUsuarios() );
  }

  mostrarModal( id: string ) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde )
        . subscribe( (res: any) => {
          console.log( res );
          this.totalregistros = res.total;
          this.usuarios = res.usuarios;
          this.cargando = false;
        });
  }

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
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {
   // console.log( termino );

   if ( termino.length <= 0 ) {
     this.cargarUsuarios();
     return;
   }

   this.cargando = true;

   this._usuarioService.buscarUsuarios( termino )
      .subscribe( (usuarios: Usuario[]) => {
        // console.log( usuarios );
        this.usuarios = usuarios;

        this.cargando = false;
      });
  }

  borrarUsuario( usuario: Usuario ) {
   // console.log ( usuario );
   if ( usuario._id === this._usuarioService.usuario._id ) {
     swal ( 'No se puede borrar usuario', 'No se puede borrar a si mismo', 'error');
     return;
   }

   swal({
     title: '¿está seguro?',
     text: 'Está a punto de borrar a ' + usuario.nombre,
     icon: 'warning',
     buttons: true,
     dangerMode: true,
   })
   .then(borrar => {
     // console.log( borrar );
     if ( borrar ) {
       this._usuarioService.borrarusuario( usuario._id)
           .subscribe ( res => {
             console.log( res );
             this.cargarUsuarios();
           });
     }
   });
  }

  guardarUsuario( usuario: Usuario ) {
    this._usuarioService.actualizarUsuario( usuario )
        .subscribe();
  }



}
