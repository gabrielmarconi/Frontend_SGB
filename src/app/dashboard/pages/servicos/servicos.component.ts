import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ServicosService } from './shared/servicos.service';
import Swal from 'sweetalert2';
import { AdicionarServicoComponent } from 'src/app/shared/components/adicionar-servico/adicionar-servico.component';
import { AtualizarValoresServicosComponent } from 'src/app/shared/components/atualizar-valores-servicos/atualizar-valores-servicos.component';
import { Router } from '@angular/router';
import { base64ToBlob } from 'src/app/shared/routines/baseToBlob';
import { autoDownloadFile } from 'src/app/shared/routines/autoDownloadFile';

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.scss'],
})
export class ServicosComponent {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    public servicosService: ServicosService
  ) {}
  displayedColumnsServicos: string[] = [
    'selecionar',
    'Descricao',
    'Valor',
    'Duracao',
    'Ativo',
    'Acoes',
  ];
  dataSourceServicos = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginatorFuncionario!: MatPaginator;

  selectedRows: any[] = [];

  ngOnInit() {
    if (localStorage.getItem('tipoUsuario') == 'C') {
      this.router.navigate(['/dashboard/clientes']);
    }
    this.titleService.setTitle('SGB - Serviços');
    this.buscarServicos();
  }

  ngAfterViewInit() {}

  public buscarServicos() {
    this.servicosService.getServicos().subscribe((servicos: any) => {
      this.dataSourceServicos = new MatTableDataSource(servicos.data);
    });
  }

  public atualizarValores() {
    const dialogRef = this.dialog.open(AtualizarValoresServicosComponent, {
      width: '600px',
      height: 'auto',
      data: {
        selections: this.selectedRows,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.servicosService.updateServicosValores(result).subscribe(
          (retorno) => {
            if (retorno) {
              Swal.fire({
                title: 'Sucesso!',
                text: 'Valores de serviços atualizados com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b2e37',
                backdrop: false,
              });
              this.buscarServicos();
              this.selectedRows = [];
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

  public adicionarServico(element: any = null, indexElement: number = null) {
    this.selectedRows = [];
    const dialogRef = this.dialog.open(AdicionarServicoComponent, {
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
          this.servicosService.postServicos(result.form).subscribe(
            (retorno) => {
              if (retorno) {
                Swal.fire({
                  title: 'Sucesso!',
                  text: 'Serviço cadastrado com sucesso!',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#3b2e37',
                  backdrop: false,
                });
                this.buscarServicos();
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
          this.servicosService
            .updateServicos(result.form, element.id)
            .subscribe(
              (retorno) => {
                if (retorno) {
                  Swal.fire({
                    title: 'Sucesso!',
                    text: 'Serviço atualizado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3b2e37',
                    backdrop: false,
                  });
                  this.buscarServicos();
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

  public removerServico(element) {
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
        this.servicosService.deleteServicos(element.id).subscribe(
          (retorno) => {
            if (retorno) {
              this.buscarServicos();
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

  headerCheckboxChange(event: any) {
    event.checked ? this.selecionarTodasLinhas() : this.desmarcarTodasLinhas();
  }

  rowCheckboxChange(event: any, row: any) {
    if (event.checked) {
      this.selectedRows.push(row);
    } else {
      const index = this.selectedRows.findIndex((r) => r === row);
      if (index >= 0) {
        this.selectedRows.splice(index, 1);
      }
    }
  }

  isSelected(row: any): boolean {
    return this.selectedRows.includes(row);
  }

  selecionarTodasLinhas() {
    this.selectedRows = this.dataSourceServicos.data.slice();
  }

  desmarcarTodasLinhas() {
    this.selectedRows = [];
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
        this.servicosService.postServicosExportacao().subscribe(
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
