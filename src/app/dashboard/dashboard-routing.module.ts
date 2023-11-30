import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guard/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { IndicadoresComponent } from './pages/indicadores/indicadores.component';
import { AtendimentosComponent } from './pages/atendimentos/atendimentos.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FormasPagamentoComponent } from './pages/formas-pagamento/formas-pagamento.component';
import { FuncionariosComponent } from './pages/funcionarios/funcionarios.component';
import { ServicosComponent } from './pages/servicos/servicos.component';

const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'indicadores', pathMatch: 'full' },
      { path: 'indicadores', component: IndicadoresComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'formas-pagamento', component: FormasPagamentoComponent },
      { path: 'funcionarios', component: FuncionariosComponent },
      { path: 'atendimentos', component: AtendimentosComponent },
      { path: 'servicos', component: ServicosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
