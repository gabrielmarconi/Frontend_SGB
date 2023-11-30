import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientesService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public postClientes(data) {
    return this.post('clientes', data);
  }

  public postClientesExportacao() {
    return this.post('clientes/exportar');
  }

  public getClientes() {
    return this.get('clientes');
  }

  public getClientesRegistros(query?: string) {
    return this.get('clientes/listagem/registros', query);
  }

  public updateClientes(data, id) {
    return this.put('clientes', data, id);
  }

  public deleteClientes(id) {
    return this.delete('clientes', id);
  }
}
