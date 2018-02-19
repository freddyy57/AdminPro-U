import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

// Servicios
import { SettingsService,
         SharedService,
         SidebarService,
         UsuarioService,
         LoginGuardGuard,
         SubirArchivoService
         } from './service.index';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    SettingsService,
    SharedService,
    SidebarService,
    UsuarioService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadService
  ]
})
export class ServiceModule { }
