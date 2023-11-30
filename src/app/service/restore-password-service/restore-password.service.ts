import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class RestorePasswordService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public postEsqueciSenha(data) {
    return this.post('usuario/esqueci-senha', data);
  }

  public postEnviarEmail(data) {
    return this.post('usuario/enviar-email/esqueci-senha', data);
  }

  public updatePassword(data, id) {
    return this.put('usuario/alterar-senha', data, id);
  }
}
