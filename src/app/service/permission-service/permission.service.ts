import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  getTipoUsuario(): string {
    return localStorage.getItem('tipoUsuario');
  }
}
