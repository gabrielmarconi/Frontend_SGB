import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AdicionarFuncionarioComponent } from 'src/app/shared/components/adicionar-funcionario/adicionar-funcionario.component';
import { FuncionariosService } from './shared/funcionarios.service';
import Swal from 'sweetalert2';
import { CadastrosService } from 'src/app/auth/cadastro/shared/cadastro.service';
import { AtualizarSenhaComponent } from 'src/app/shared/components/atualizar-senha/atualizar-senha.component';
import { RestorePasswordService } from 'src/app/service/restore-password-service/restore-password.service';
import { Router } from '@angular/router';
import { base64ToBlob } from 'src/app/shared/routines/baseToBlob';
import { autoDownloadFile } from 'src/app/shared/routines/autoDownloadFile';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent {
  constructor(
    public dialog: MatDialog,
    private titleService: Title,
    private router: Router,
    private funcionarioService: FuncionariosService,
    private cadastroService: CadastrosService,
    public restorePasswordService: RestorePasswordService
  ) {}
  displayedColumnsFuncionario: string[] = ['NomeFuncionario', 'Email', 'Acoes'];
  dataSourceFuncionario = new MatTableDataSource<any>();

  ngOnInit() {
    this.titleService.setTitle('SGB - Funcionários');
    if (localStorage.getItem('tipoUsuario') == 'C') {
      this.router.navigate(['/dashboard/clientes']);
    }
    this.buscarFuncionario();
  }

  ngAfterViewInit() {}

  public buscarFuncionario() {
    this.funcionarioService
      .getFuncionariosRegistros()
      .subscribe((funcionario: any) => {
        this.dataSourceFuncionario = new MatTableDataSource(
          funcionario.data[0].Registros
        );
      });
  }

  public adicionarFuncionario(
    element: any = null,
    indexElement: number = null
  ) {
    const dialogRef = this.dialog.open(AdicionarFuncionarioComponent, {
      width: '1000px',
      height: 'auto',
      data: {
        element,
        indexElement,
        dataSource: this.dataSourceFuncionario.data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result == 'object') {
        if (result.edit == false) {
          //chama o post de usuario passando o formulario como parametro
          this.cadastroService
            .postCadastros(result.form)
            .subscribe((cadastro: any) => {
              if (cadastro) {
                //se passou, chama o post de funcionario passando o id
                this.funcionarioService
                  .postFuncionarios({ idUsuario: cadastro.data.id })
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
                        this.buscarFuncionario();
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
                      this.buscarFuncionario();
                    }
                  );
              }
            });
        } else {
          //chama o update de cadastros passando o formulario e o id
          this.cadastroService
            .updateCadastros(result.form, element.idUsuario)
            .subscribe(
              (retorno: any) => {
                //se der certo, chama o update de clientes passando o id usuario
                this.funcionarioService
                  .updateFuncionarios(
                    { idUsuario: retorno.data.id },
                    element.id
                  )
                  .subscribe(
                    (response) => {
                      if (response) {
                        Swal.fire({
                          title: 'Sucesso!',
                          text: 'Funcionário atualizado com sucesso!',
                          icon: 'success',
                          confirmButtonText: 'OK',
                          confirmButtonColor: '#3b2e37',
                          backdrop: false,
                        });
                        this.buscarFuncionario();
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

  public removerFuncionario(element) {
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
          this.funcionarioService.deleteFuncionarios(element.id).subscribe(
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
                this.buscarFuncionario();
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
        this.funcionarioService.postFuncionariosExportacao().subscribe(
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
