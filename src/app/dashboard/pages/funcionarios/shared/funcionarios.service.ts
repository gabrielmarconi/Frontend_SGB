import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public postFuncionarios(data) {
    return this.post('funcionarios', data);
  }

  public postFuncionariosExportacao() {
    return this.post('funcionarios/exportar');
  }

  public getFuncionarios() {
    return this.get('funcionarios');
  }

  public updateFuncionarios(data, id) {
    return this.put('funcionarios', data, id);
  }

  public deleteFuncionarios(id) {
    return this.delete('funcionarios', id);
  }

  public getFuncionariosRegistros() {
    return this.get('funcionarios/listagem/registros');
  }
}
