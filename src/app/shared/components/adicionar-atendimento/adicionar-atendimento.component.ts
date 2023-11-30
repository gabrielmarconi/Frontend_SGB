import { Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import {
  Observable,
  ReplaySubject,
  Subject,
  map,
  startWith,
  takeUntil,
} from 'rxjs';
import { ClientesService } from 'src/app/dashboard/pages/clientes/shared/clientes.service';
import { FormasPagamentoService } from 'src/app/dashboard/pages/formas-pagamento/shared/formas-pagamento.service';
import { FuncionariosService } from 'src/app/dashboard/pages/funcionarios/shared/funcionarios.service';
import { AdicionarServicoComponent } from '../adicionar-servico/adicionar-servico.component';
import { AdicionarServicoAtendimentoComponent } from '../adicionar-servico-atendimento/adicionar-servico-atendimento.component';
import Swal from 'sweetalert2';
import { AtendimentosService } from 'src/app/dashboard/pages/atendimentos/shared/atendimentos.service';

@Component({
  selector: 'app-adicionar-atendimento',
  templateUrl: './adicionar-atendimento.component.html',
  styleUrls: ['./adicionar-atendimento.component.scss'],
})
export class AdicionarAtendimentoComponent {
  constructor(
    public dialogRef: MatDialogRef<AdicionarAtendimentoComponent>,
    public dialog: MatDialog,
    public clientesService: ClientesService,
    public funcionarioService: FuncionariosService,
    public formaPagamentoService: FormasPagamentoService,
    public atendimentosService: AtendimentosService,
    private fb: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  protected clientes: Array<any>;
  protected funcionarios: Array<any>;
  protected formasPagamento: Array<any>;

  dataSourceServico = new MatTableDataSource<any>();
  displayedColumnsServicos: string[] = [
    'Descricao',
    'Duracao',
    'Valor',
    'Acoes',
  ];

  public showPass: boolean = false;

  protected _onDestroy = new Subject<void>();
  idCliente = localStorage.getItem('idCliente');
  clienteFilterCtrl = new FormControl(null);
  funcionarioFilterCtrl = new FormControl(null);
  formasPagamentoFilterCtrl = new FormControl(null);

  atendimentosForm = new FormGroup({
    id: new FormControl(null),
    idCliente: new FormControl(null, [Validators.required]),
    idFuncionario: new FormControl(null, [Validators.required]),
    idFormaPagamento: new FormControl(null, [Validators.required]),
    dataHoraTermino: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
    dataHora: new FormControl(null, [Validators.required]),
    confirmado: new FormControl('N'),
    valorTotal: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
    valorDesconto: new FormControl({ value: null, disabled: true }, [
      Validators.required,
    ]),
    servicos: new FormArray([], [Validators.required]),
  });

  public filteredClientes: ReplaySubject<Array<any>> = new ReplaySubject<
    Array<any>
  >(1);

  public filteredFuncionarios: ReplaySubject<Array<any>> = new ReplaySubject<
    Array<any>
  >(1);

  public filteredFormasPagamento: ReplaySubject<Array<any>> = new ReplaySubject<
    Array<any>
  >(1);

  isEdit = new FormControl(false);

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    this.clientesService.getClientesRegistros().subscribe((clientes: any) => {
      if (clientes) {
        this.clientes = clientes.data[0].Registros;
        this.clienteFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy), startWith(''))
          .subscribe(() => {
            this.filterClientes();
          });
      }
    });

    this.funcionarioService
      .getFuncionariosRegistros()
      .subscribe((funcionarios: any) => {
        if (funcionarios) {
          this.funcionarios = funcionarios.data[0].Registros;
          this.funcionarioFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy), startWith(''))
            .subscribe(() => {
              this.filterFuncionarios();
            });
        }
      });

    this.formaPagamentoService
      .getFormasPagamento()
      .subscribe((formasPagamento: any) => {
        if (formasPagamento) {
          this.formasPagamento = formasPagamento.data;
          this.formasPagamentoFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy), startWith(''))
            .subscribe(() => {
              this.filterFormasPagamento();
            });
        }
      });

    if (localStorage.getItem('tipoUsuario') == 'C') {
      this.atendimentosForm.get('idCliente').setValue(+this.idCliente);
      this.atendimentosForm.get('idCliente').disable();
    }
    if (this.data.element) {
      this.icon = 'edit';
      this.title = 'Editar Atendimento';
      this.atendimentosForm.patchValue(this.data.element);

      const servicosForm = this.atendimentosForm.get('servicos') as FormArray;
      this.atendimentosService
        .getAtendimentosServicosRegistros(this.data.element.id)
        .subscribe((servicos: any) => {
          const registros = servicos.data[0].Registros;
          this.dataSourceServico = new MatTableDataSource(
            servicos.data[0].Registros
          );

          registros.forEach((registro: any) => {
            const formGroup = this.fb.group({
              idAtendimento: [registro.idAtendimento],
              idServico: [registro.idServico],
              descricao: [registro.descricao],
              valor: [registro.valor],
              duracao: [registro.duracao],
            });

            servicosForm.push(formGroup);
          });
        });

      if (this.atendimentosForm.get('dataHora').value) {
        this.atendimentosForm
          .get('dataHora')
          .setValue(
            moment
              .utc(this.atendimentosForm.get('dataHora').value)
              .format('YYYY-MM-DDTHH:mm')
          );
      }

      if (this.atendimentosForm.get('dataHoraTermino').value) {
        this.atendimentosForm
          .get('dataHoraTermino')
          .setValue(
            moment
              .utc(this.atendimentosForm.get('dataHoraTermino').value)
              .format('YYYY-MM-DDTHH:mm')
          );
      }

      this.isEdit.setValue(true);
    } else {
      this.icon = 'add';
      this.title = 'Adicionar Atendimento';
    }
  }

  adicionarAtendimento(): void {
    this.atendimentosService
      .postAtendimentosVerificarExistente(
        this.data.element
          ? {
              idAtendimento: this.atendimentosForm.get('id').value,
              dataInicio: this.atendimentosForm.get('dataHora').value,
              dataTermino: this.atendimentosForm.get('dataHoraTermino').value,
              idFuncionario: this.atendimentosForm.get('idFuncionario').value,
            }
          : {
              dataInicio: this.atendimentosForm.get('dataHora').value,
              dataTermino: this.atendimentosForm.get('dataHoraTermino').value,
              idFuncionario: this.atendimentosForm.get('idFuncionario').value,
            }
      )
      .subscribe((result: any) => {
        if (result.data[0].MensagemErro == '') {
          if (this.atendimentosForm.get('dataHora').value) {
            this.atendimentosForm
              .get('dataHora')
              .setValue(
                moment
                  .utc(this.atendimentosForm.get('dataHora').value)
                  .format('YYYY-MM-DDTHH:mm:ss[Z]')
              );
          }

          if (this.atendimentosForm.get('dataHoraTermino').value) {
            this.atendimentosForm
              .get('dataHoraTermino')
              .setValue(
                moment
                  .utc(this.atendimentosForm.get('dataHoraTermino').value)
                  .format('YYYY-MM-DDTHH:mm:ss[Z]')
              );
          }

          let servicosForm = this.atendimentosForm.get('servicos') as FormArray;

          let novaArrayDeServicos = servicosForm.value.map((servico) => ({
            idServico: servico.idServico,
          }));

          this.atendimentosForm.value.servicos = novaArrayDeServicos;

          this.dialogRef.close({
            form: this.atendimentosForm.getRawValue(),
            edit: this.isEdit.value,
          });
        } else {
          Swal.fire({
            title: 'Erro!',
            text: 'Existe pelo menos um atendimento no período informado para o mesmo funcionário!',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3b2e37',
            backdrop: false,
          });
        }
      });
  }

  protected filterClientes() {
    if (!this.clientes) {
      return;
    }
    let search = this.clienteFilterCtrl.value;
    if (!search) {
      this.filteredClientes.next(this.clientes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredClientes.next(
      this.clientes.filter(
        (cliente) => cliente.nome.toLowerCase().indexOf(search) > -1
      )
    );
  }

  protected filterFuncionarios() {
    if (!this.funcionarios) {
      return;
    }
    let search = this.funcionarioFilterCtrl.value;
    if (!search) {
      this.filteredFuncionarios.next(this.funcionarios.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredFuncionarios.next(
      this.funcionarios.filter(
        (funcionario) => funcionario.nome.toLowerCase().indexOf(search) > -1
      )
    );
  }

  protected filterFormasPagamento() {
    if (!this.formasPagamento) {
      return;
    }
    let search = this.formasPagamentoFilterCtrl.value;
    if (!search) {
      this.filteredFormasPagamento.next(this.formasPagamento.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredFormasPagamento.next(
      this.formasPagamento.filter(
        (formaPagamento) =>
          formaPagamento.descricao.toLowerCase().indexOf(search) > -1
      )
    );
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  public setCheckbox(event: any, campo: string): void {
    event.checked
      ? this.atendimentosForm.get(campo).setValue('S')
      : this.atendimentosForm.get(campo).setValue('N');
  }

  public adicionarServico(element: any = null, indexElement: number = null) {
    const dialogRef = this.dialog.open(AdicionarServicoAtendimentoComponent, {
      width: '1000px',
      height: 'auto',
      disableClose: true,
      autoFocus: false,
      data: {
        element,
        indexElement,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      const servicoForm = this.atendimentosForm.get('servicos') as FormArray;
      if (typeof result == 'object') {
        if (result.edit == false) {
          const control = new FormGroup({
            idAtendimento: new FormControl(result.form.idAtendimento),
            idServico: new FormControl(result.form.idServico),
            duracao: new FormControl(result.form.duracao),
            valor: new FormControl(result.form.valor),
            descricao: new FormControl(result.form.descricao),
          });
          servicoForm.push(control);
        } else {
          servicoForm.controls[indexElement].setValue(result.form);
        }
        this.dataSourceServico = new MatTableDataSource(
          this.atendimentosForm.get('servicos').value
        );
      }
      this.getTotalServicos();
      this.getTotalMinutos();
    });
  }

  public removerServico(indexElement: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'O registro será excluído permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apague!',
      cancelButtonText: 'Não, engano',
      confirmButtonColor: '#3b2e37',
      backdrop: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const servicoForm = this.atendimentosForm.get('servicos') as FormArray;
        servicoForm.removeAt(indexElement);
        this.dataSourceServico = new MatTableDataSource(
          this.atendimentosForm.get('servicos').value
        );
        Swal.fire({
          title: 'Deletado!',
          text: 'Serviço deletado com sucesso!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b2e37',
          backdrop: false,
        });
      } else if (result.dismiss || result.isDismissed) {
        Swal.fire({
          title: 'Cancelado!',
          text: 'Operação cancelada!',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b2e37',
          backdrop: false,
        });
      }
      this.getTotalServicos();
      this.getTotalMinutos();
    });
  }

  public getTotalServicos() {
    let valorTotal = 0;
    const servicoForm = this.atendimentosForm.get('servicos') as FormArray;

    servicoForm.controls.forEach((control: any) => {
      valorTotal += control.value.valor;
    });

    this.atendimentosForm.get('valorTotal').setValue(valorTotal);
  }

  public getTotalMinutos() {
    let valorTotalMinutos = 0;
    const servicoForm = this.atendimentosForm.get('servicos') as FormArray;

    servicoForm.controls.forEach((control: any) => {
      valorTotalMinutos += control.value.duracao;
    });

    const dataInicial = moment(this.atendimentosForm.get('dataHora').value);
    const dataFinal = dataInicial
      .clone()
      .add(valorTotalMinutos, 'minutes')
      .format('YYYY-MM-DDTHH:mm');
    this.atendimentosForm.get('dataHoraTermino').setValue(dataFinal);
  }
}
