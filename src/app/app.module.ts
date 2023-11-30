import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphicComponent } from './shared/components/pie-graphic/pie-graphic.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard/dashboard-routing.module';
import { IndicadoresComponent } from './dashboard/pages/indicadores/indicadores.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { ClientesComponent } from './dashboard/pages/clientes/clientes.component';
import { FuncionariosComponent } from './dashboard/pages/funcionarios/funcionarios.component';
import { FormasPagamentoComponent } from './dashboard/pages/formas-pagamento/formas-pagamento.component';
import { AtendimentosComponent } from './dashboard/pages/atendimentos/atendimentos.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { AdicionarAtendimentoComponent } from './shared/components/adicionar-atendimento/adicionar-atendimento.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AdicionarClienteComponent } from './shared/components/adicionar-cliente/adicionar-cliente.component';
import { AdicionarFormaPagamentoComponent } from './shared/components/adicionar-forma-pagamento/adicionar-forma-pagamento.component';
import { AdicionarFuncionarioComponent } from './shared/components/adicionar-funcionario/adicionar-funcionario.component';
import { ServicosComponent } from './dashboard/pages/servicos/servicos.component';
import { AdicionarServicoComponent } from './shared/components/adicionar-servico/adicionar-servico.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AuthInterceptor } from './shared/interceptors/authorization.interceptor';
import { RecuperarSenhaComponent } from './shared/components/recuperar-senha/recuperar-senha.component';
import { AtualizarSenhaComponent } from './shared/components/atualizar-senha/atualizar-senha.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AtualizarValoresServicosComponent } from './shared/components/atualizar-valores-servicos/atualizar-valores-servicos.component';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AdicionarServicoAtendimentoComponent } from './shared/components/adicionar-servico-atendimento/adicionar-servico-atendimento.component';
import { ConcederDescontoComponent } from './shared/components/conceder-desconto-atendimento/conceder-desconto-atendimento.component';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    AppComponent,
    IndicadoresComponent,
    GraphicComponent,
    CadastroComponent,
    FuncionariosComponent,
    ClientesComponent,
    FormasPagamentoComponent,
    AtendimentosComponent,
    AdicionarAtendimentoComponent,
    AdicionarClienteComponent,
    AdicionarFormaPagamentoComponent,
    AdicionarFuncionarioComponent,
    ServicosComponent,
    AdicionarServicoComponent,
    RecuperarSenhaComponent,
    AtualizarSenhaComponent,
    AtualizarValoresServicosComponent,
    AdicionarServicoAtendimentoComponent,
    ConcederDescontoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    DashboardRoutingModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatSnackBarModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatCardModule,
    MatListModule,
    NgxChartsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatListModule,
    MatDialogModule,
    CurrencyMaskModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
