import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AdicionarClienteComponent } from 'src/app/shared/components/adicionar-cliente/adicionar-cliente.component';
import { ClientesService } from './shared/clientes.service';
import { CadastrosService } from 'src/app/auth/cadastro/shared/cadastro.service';
import Swal from 'sweetalert2';
import { PermissionService } from 'src/app/service/permission-service/permission.service';
import { AtualizarSenhaComponent } from 'src/app/shared/components/atualizar-senha/atualizar-senha.component';
import { RestorePasswordService } from 'src/app/service/restore-password-service/restore-password.service';
import { base64ToBlob } from 'src/app/shared/routines/baseToBlob';
import { autoDownloadFile } from 'src/app/shared/routines/autoDownloadFile';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent {
  constructor(
    public dialog: MatDialog,
    private titleService: Title,
    private clienteService: ClientesService,
    private cadastroService: CadastrosService,
    public permissionService: PermissionService,
    public restorePasswordService: RestorePasswordService
  ) {}
  dataSourceCliente = new MatTableDataSource<any>();
  displayedColumnsCliente: string[] = ['NomeCliente', 'Email', 'Acoes'];

  queryClientes: string = '';
  idUsuario = localStorage.getItem('idUsuario');
  tipoUsuario = localStorage.getItem('tipoUsuario');

  @ViewChild(MatPaginator) paginatorCliente!: MatPaginator;

  ngOnInit() {
    this.titleService.setTitle('SGB - Clientes');

    if (localStorage.getItem('tipoUsuario') == 'C')
      this.queryClientes = `propertieName=id&propertieValue=${this.idUsuario}`;

    this.buscarClientes();
  }

  ngAfterViewInit() {}

  public buscarClientes() {
    this.clienteService
      .getClientesRegistros(this.queryClientes)
      .subscribe((cliente: any) => {
        this.dataSourceCliente = new MatTableDataSource(
          cliente.data[0].Registros
        );
      });
  }

  public adicionarCliente(element: any = null, indexElement: number = null) {
    const dialogRef = this.dialog.open(AdicionarClienteComponent, {
      width: '1000px',
      height: 'auto',
      data: {
        element,
        indexElement,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result == 'object') {
        if (result.edit == false) {
          //chama o post de usuario passando o formulario como parametro
          this.cadastroService.postCadastros(result.form).subscribe(
            (cadastro: any) => {
              if (cadastro) {
                //se passou, chama o post de cliente passando o id
                this.clienteService
                  .postClientes({ idUsuario: cadastro.data.id })
                  .subscribe(
                    (response) => {
                      if (response) {
                        Swal.fire({
                          title: 'Sucesso!',
                          text: 'Cadastro realizado com sucesso!',
                          icon: 'success',
                          confirmButtonText: 'OK',
                          confirmButtonColor: '#3b2e37',
                          backdrop: false,
                        });
                        this.buscarClientes();
                      }
                    },
                    (error) => {
                      Swal.fire({
                        title: 'Erro!',
                        text: error.error.message[0],
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3b2e37',
                        backdrop: false,
                      });
                      this.buscarClientes();
                    }
                  );
              }
            },
            (error) => {
              Swal.fire({
                title: 'Erro!',
                text: error.error.message[0],
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b2e37',
                backdrop: false,
              });
            }
          );
        } else {
          //chama o update de cadastros passando o formulario e o id
          this.cadastroService
            .updateCadastros(result.form, element.idUsuario)
            .subscribe(
              (retorno: any) => {
                //se der certo, chama o update de clientes passando o id usuario
                this.clienteService
                  .updateClientes({ idUsuario: retorno.data.id }, element.id)
                  .subscribe(
                    (response) => {
                      if (response) {
                        Swal.fire({
                          title: 'Sucesso!',
                          text: 'Cliente atualizado com sucesso!',
                          icon: 'success',
                          confirmButtonText: 'OK',
                          confirmButtonColor: '#3b2e37',
                          backdrop: false,
                        });
                        this.buscarClientes();
                      }
                    },
                    (error) => {
                      Swal.fire({
                        title: 'Erro!',
                        text: error.error.message[0],
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3b2e37',
                        backdrop: false,
                      });
                    }
                  );
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

  public removerCliente(element) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'O registro será excluído permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apague!',
      confirmButtonColor: '#3b2e37',
      cancelButtonText: 'Não, engano',
      backdrop: false,
    }).then(
      (result) => {
        if (result.isConfirmed) {
          //chama o delete de cliente passando o id como parametro
          this.clienteService.deleteClientes(element.id).subscribe(
            (retornoCliente) => {
              if (retornoCliente) {
                Swal.fire({
                  title: 'Deletado!',
                  text: 'Registro deletado com sucesso!',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#3b2e37',
                  backdrop: false,
                });
                this.buscarClientes();
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

  public atualizarSenha(element) {
    const dialogRef = this.dialog.open(AtualizarSenhaComponent, {
      width: '600px',
      height: 'auto',
      disableClose: true,
      data: {
        element,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restorePasswordService
          .updatePassword(result, element.idUsuario)
          .subscribe(
            (retorno) => {
              if (retorno) {
                Swal.fire({
                  title: 'Sucesso!',
                  text: 'Senha atualizada com sucesso!',
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
        this.clienteService.postClientesExportacao().subscribe(
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
