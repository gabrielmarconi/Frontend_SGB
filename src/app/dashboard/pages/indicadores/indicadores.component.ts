import { Component } from '@angular/core';
import { graphicData } from 'src/app/shared/components/pie-graphic/graphicData';
import { graphicCustomColors } from 'src/app/shared/components/pie-graphic/graphicData';
import { IndicadoresService } from './shared/indicadores.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.scss'],
})
export class IndicadoresComponent {
  //Dados importados do arquivo graphicData.ts
  dadosDoGraficoAbertos: Array<any>;
  dadosDoGraficoMes: Array<any>;
  dadosDoGraficoCliente: Array<any>;
  dadosDoGraficoFuncionario: Array<any>;
  dadosDoGraficoServico: Array<any>;

  constructor(
    private indicadoresService: IndicadoresService,
    public titleService: Title,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('tipoUsuario') == 'C') {
      this.router.navigate(['/dashboard/clientes']);
    }
    this.titleService.setTitle('SGB - Indicadores');
    this.obterDadosIndicadores();
  }

  obterDadosIndicadores() {
    this.indicadoresService.getIndicadores().subscribe((dados: any) => {
      if (dados) {
        if (
          dados.data[0].Detalhes.length > 0 &&
          dados.data[0].Detalhes[0].value > 0
        )
          this.dadosDoGraficoAbertos = dados.data[0].Detalhes;
        if (
          dados.data[1].Detalhes.length > 0 &&
          dados.data[1].Detalhes[0].value > 0
        )
          this.dadosDoGraficoMes = dados.data[1].Detalhes;
        if (
          dados.data[2].Detalhes.length > 0 &&
          dados.data[2].Detalhes[0].value > 0
        )
          this.dadosDoGraficoCliente = dados.data[2].Detalhes;
        if (
          dados.data[3].Detalhes.length > 0 &&
          dados.data[3].Detalhes[0].value > 0
        )
          this.dadosDoGraficoFuncionario = dados.data[3].Detalhes;
        if (
          dados.data[4].Detalhes.length > 0 &&
          dados.data[4].Detalhes[0].value > 0
        )
          this.dadosDoGraficoServico = dados.data[4].Detalhes;
      }
    });
  }

  hasDataForGraphics(): boolean {
    if (
      this.dadosDoGraficoAbertos ||
      this.dadosDoGraficoMes ||
      this.dadosDoGraficoCliente ||
      this.dadosDoGraficoFuncionario ||
      this.dadosDoGraficoServico
    ) {
      return true;
    } else {
      return false;
    }
  }
}
