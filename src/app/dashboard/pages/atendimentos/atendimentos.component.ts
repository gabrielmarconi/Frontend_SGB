import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AdicionarAtendimentoComponent } from 'src/app/shared/components/adicionar-atendimento/adicionar-atendimento.component';
import { AtendimentosService } from './shared/atendimentos.service';
import Swal from 'sweetalert2';
import { ConcederDescontoComponent } from 'src/app/shared/components/conceder-desconto-atendimento/conceder-desconto-atendimento.component';
import { base64ToBlob } from 'src/app/shared/routines/baseToBlob';
import { autoDownloadFile } from 'src/app/shared/routines/autoDownloadFile';

@Component({
  selector: 'app-atendimentos',
  templateUrl: './atendimentos.component.html',
  styleUrls: ['./atendimentos.component.scss'],
})
export class AtendimentosComponent {
  constructor(
    public dialog: MatDialog,
    public titleService: Title,
    public atendimentosService: AtendimentosService
  ) {}

  queryClientes: string = '';
  idCliente = localStorage.getItem('idCliente');
  tipoUsuario = localStorage.getItem('tipoUsuario');

  atendimentosForm = new FormGroup({
    idCliente: new FormControl(null),
    idFuncionario: new FormControl(null),
    idFormaPagamento: new FormControl(null),
    dataHora: new FormControl(null),
    confirmado: new FormControl(null),
    valorTotal: new FormControl(null),
    valorDesconto: new FormControl(null),
    registros: new FormArray([]),
  });

  dataSourceAtendimentos = new MatTableDataSource<any>();
  displayedColumnsAtendimento: string[] = [
    'NomeCliente',
    'NomeFuncionario',
    'FormaPagamento',
    'Valor',
    'Acoes',
  ];

  @ViewChild(MatPaginator) paginatorAtendimento!: MatPaginator;

  ngOnInit() {
    this.titleService.setTitle('SGB - Atendimentos');
    if (localStorage.getItem('tipoUsuario') == 'C')
      this.queryClientes = `propertieName=id&propertieValue=${this.idCliente}`;

    this.buscarAtendimentos();
  }

  ngAfterViewInit() {
    this.dataSourceAtendimentos.paginator = this.paginatorAtendimento;
  }

  public buscarAtendimentos() {
    this.atendimentosService
      .getAtendimentosRegistros(this.queryClientes)
      .subscribe((atendimento: any) => {
        this.dataSourceAtendimentos = new MatTableDataSource(
          atendimento.data[0].Registros
        );
      });
  }

  public adicionarAtendimento(
    element: any = null,
    indexElement: number = null
  ) {
    const dialogRef = this.dialog.open(AdicionarAtendimentoComponent, {
      width: '1300px',
      height: 'auto',
      data: {
        element,
        indexElement,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result == 'object') {
        if (result.edit == false) {
          this.atendimentosService.postAtendimentos(result.form).subscribe(
            (retorno) => {
              if (retorno) {
                Swal.fire({
                  title: 'Sucesso!',
                  text: 'Atendimento cadastrado com sucesso!',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#3b2e37',
                  backdrop: false,
                });
                this.buscarAtendimentos();
              }
            },
            (error) => {
              Swal.fire({
                title: 'Erro!',
                text: `${error.error.message[0]}`,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b2e37',
                backdrop: false,
              });
            }
          );
        } else {
          this.atendimentosService
            .updateAtendimentos(result.form, element.id)
            .subscribe(
              (retorno) => {
                if (retorno) {
                  Swal.fire({
                    title: 'Sucesso!',
                    text: 'Atendimento atualizado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3b2e37',
                    backdrop: false,
                  });
                  this.buscarAtendimentos();
                }
              },
              (error) => {
                Swal.fire({
                  title: 'Erro!',
                  text: `${error.error.message[0]}`,
                  icon: 'error',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#3b2e37',
                  backdrop: false,
                });
              }
            );
        }
      }
    });
  }

  public removerAtendimento(element) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'O registro será excluído permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apague!',
      confirmButtonColor: '#3b2e37',
      cancelButtonText: 'Não, engano',
      backdrop: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.atendimentosService.deleteAtendimentos(element.id).subscribe(
          (retorno) => {
            if (retorno) {
              this.buscarAtendimentos();
              Swal.fire({
                title: 'Deletado!',
                text: 'Registro deletado com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b2e37',
                backdrop: false,
              });
            }
          },
          (error) => {
            Swal.fire({
              title: 'Erro!',
              text: `${error.error.message[0]}`,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#3b2e37',
              backdrop: false,
            });
          }
        );
      } else if (result.dismiss || result.isDismissed) {
        Swal.fire({
          title: 'Cancelado!',
          text: 'Operação foi cancelada!',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b2e37',
          backdrop: false,
        });
      }
    });
  }

  public concederDesconto(element) {
    const dialogRef = this.dialog.open(ConcederDescontoComponent, {
      width: '600px',
      height: 'auto',
      data: {
        element,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.atendimentosService
          .updateConcederDescontoAtendimento(result, element.id)
          .subscribe(
            (retorno) => {
              if (retorno) {
                Swal.fire({
                  title: 'Sucesso!',
                  text: 'Desconto concedido com sucesso!',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#3b2e37',
                  backdrop: false,
                });
                this.buscarAtendimentos();
              }
            },
            (error) => {
              Swal.fire({
                title: 'Erro!',
                text: `${error.error.message[0]}`,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b2e37',
                backdrop: false,
              });
            }
          );
      }
    });
  }

  public confirmarAtendimento(element) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'O atendimento será confirmado!',
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      denyButtonText: `Deletar atendimento`,
      confirmButtonText: 'Sim, confirmar!',
      confirmButtonColor: '#3b2e37',
      cancelButtonText: 'Não, engano.',
      allowOutsideClick: true,
      backdrop: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.atendimentosService
          .updateConfirmarAtendimento({ confirmado: 'S' }, element.id)
          .subscribe(
            (retorno) => {
              if (retorno) {
                Swal.fire({
                  title: 'Confirmado!',
                  text: 'Atendimento confirmado com sucesso!',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#3b2e37',
                  backdrop: false,
                });
                this.buscarAtendimentos();
              }
            },
            (error) => {
              Swal.fire({
                title: 'Erro!',
                text: `${error.error.message[0]}`,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b2e37',
                backdrop: false,
              });
            }
          );
      } else if (result.isDenied) {
        this.atendimentosService
          .updateConfirmarAtendimento({ confirmado: 'N' }, element.id)
          .subscribe(
            (retorno) => {
              if (retorno) {
                Swal.fire({
                  title: 'Deletado!',
                  text: 'Atendimento deletado com sucesso!',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#3b2e37',
                  backdrop: false,
                });
                this.buscarAtendimentos();
              }
            },
            (error) => {
              Swal.fire({
                title: 'Erro!',
                text: `${error.error.message[0]}`,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b2e37',
                backdrop: false,
              });
            }
          );
      }
    });
  }

  public gerarExcel() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja exportar os dados para excel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, exportar!',
      confirmButtonColor: '#3b2e37',
      cancelButtonText: 'Não, engano',
      backdrop: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.atendimentosService.postAtendimentosExportacao().subscribe(
          (retorno: any) => {
            if (retorno?.data) {
              // realiza a conversao do base64 para blob
              const blob = base64ToBlob(retorno.data.content);
              // chama a funcao para realizar o download do arquivo
              autoDownloadFile(blob, retorno.data.filename);
            }
          },
          (error) => {
            Swal.fire('Erro', error.error.erros[0].message, 'error');
          }
        );
        return;
      }
      if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Operação foi cancelada!', 'error');
      }
    });
  }
}
