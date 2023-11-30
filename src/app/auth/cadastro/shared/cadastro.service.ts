import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CadastrosService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public postCadastros(data) {
    return this.post('usuario', data);
  }

  public updateCadastros(data, id) {
    return this.put('usuario', data, id);
  }

  public deleteCadastros(id) {
    return this.delete('usuario', id);
  }

  public updateEmail(data, id) {
    return this.put('usuario', data, id);
  }
}
