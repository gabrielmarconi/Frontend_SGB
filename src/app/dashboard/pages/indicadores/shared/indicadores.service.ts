import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IndicadoresService extends ApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  public getIndicadores() {
    return this.get('indicadores/totalizador');
  }
}
