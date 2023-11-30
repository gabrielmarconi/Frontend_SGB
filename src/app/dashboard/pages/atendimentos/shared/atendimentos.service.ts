import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AtendimentosService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public postAtendimentos(data) {
    return this.post('atendimentos', data);
  }

  public postAtendimentosExportacao() {
    return this.post('atendimentos/exportar');
  }

  public getAtendimentos() {
    return this.get('atendimentos');
  }

  public getAtendimentosRegistros(query?: string) {
    return this.get('atendimentos/listagem/registros', query);
  }

  public getAtendimentosServicosRegistros(id) {
    return this.getId('atendimentos/listagem/servicos', id);
  }

  public updateAtendimentos(data, id) {
    return this.put('atendimentos', data, id);
  }

  public postAtendimentosVerificarExistente(data) {
    return this.post('atendimentos/verificar/existente', data);
  }

  public updateConfirmarAtendimento(data, id) {
    return this.put('atendimentos/confirmar', data, id);
  }

  public updateConcederDescontoAtendimento(data, id) {
    return this.put('atendimentos/conceder-desconto', data, id);
  }

  public deleteAtendimentos(id) {
    return this.delete('atendimentos', id);
  }
}
