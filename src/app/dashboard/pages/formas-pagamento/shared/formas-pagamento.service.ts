import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FormasPagamentoService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public postFormasPagamento(data) {
    return this.post('formas-pagamento', data);
  }

  public postFormasPagamentoExportacao() {
    return this.post('formas-pagamento/exportar');
  }

  public getFormasPagamento() {
    return this.get('formas-pagamento');
  }

  public updateFormasPagamento(data, id) {
    return this.put('formas-pagamento', data, id);
  }

  public deleteFormasPagamento(id) {
    return this.delete('formas-pagamento', id);
  }
}
