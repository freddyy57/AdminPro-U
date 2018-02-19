import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { SubirArchivoService } from '../../services/service.index';
import { ModalUploadService } from './modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  constructor( public _subirArchivoService: SubirArchivoService,
               public _modalUploadService: ModalUploadService) {}

  ngOnInit() {
  }

  subirImagen() {
    // console.log('Holaa');
    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id)
          .then( res => {
            console.log( res );
            this._modalUploadService.notificacion.emit( res );
            this.cerrarModal();
          })
          .catch( err => {
            console.log('Error en la carga...');
          });
  }



  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalUploadService.ocultarModal();
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

}
