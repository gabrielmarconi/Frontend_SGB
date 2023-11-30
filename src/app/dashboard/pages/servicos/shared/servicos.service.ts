import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServicosService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public postServicos(data) {
    return this.post('servicos', data);
  }

  public postServicosExportacao() {
    return this.post('servicos/exportar');
  }

  public getServicos() {
    return this.get('servicos');
  }

  public updateServicos(data, id) {
    return this.put('servicos', data, id);
  }

  public deleteServicos(id) {
    return this.delete('servicos', id);
  }

  public updateServicosValores(data) {
    return this.put('servicos/atualizar/valores', data);
  }
}
