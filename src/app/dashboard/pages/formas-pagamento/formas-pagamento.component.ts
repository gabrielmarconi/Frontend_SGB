import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { AdicionarFormaPagamentoComponent } from 'src/app/shared/components/adicionar-forma-pagamento/adicionar-forma-pagamento.component';
import { FormasPagamentoService } from './shared/formas-pagamento.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { base64ToBlob } from 'src/app/shared/routines/baseToBlob';
import { autoDownloadFile } from 'src/app/shared/routines/autoDownloadFile';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.component.html',
  styleUrls: ['./formas-pagamento.component.scss'],
})
export class FormasPagamentoComponent {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    public formasPagamentoService: FormasPagamentoService
  ) {}

  dataSourceFormaPagamento = new MatTableDataSource<any>();
  displayedColumnsFormaPagamento: string[] = ['Descricao', 'Acoes'];

  formasPagamentoForm = new FormGroup({
    descricao: new FormControl(null, [Validators.required]),
  });

  @ViewChild(MatPaginator) paginatorFormaPagamento!: MatPaginator;

  ngOnInit() {
    if (localStorage.getItem('tipoUsuario') == 'C') {
      this.router.navigate(['/dashboard/clientes']);
    }
    this.titleService.setTitle('SGB - Formas de Pagamento');
    this.buscarFormasPagamento();
  }

  ngAfterViewInit() {
    this.dataSourceFormaPagamento.paginator = this.paginatorFormaPagamento;
  }

  public buscarFormasPagamento() {
    this.formasPagamentoService
      .getFormasPagamento()
      .subscribe((formasPagamento: any) => {
        this.dataSourceFormaPagamento = new MatTableDataSource(
          formasPagamento.data
        );
      });
  }

  public adicionarFormaPagamento(
    element: any = null,
    indexElement: number = null
  ) {
    const dialogRef = this.dialog.open(AdicionarFormaPagamentoComponent, {
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
          this.formasPagamentoService
            .postFormasPagamento(result.form)
            .subscribe(
              (retorno) => {
                if (retorno) {
                  Swal.fire({
                    title: 'Sucesso!',
                    text: 'Forma de Pagamento cadastrada com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3b2e37',
                    backdrop: false,
                  });
                  this.buscarFormasPagamento();
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
          this.formasPagamentoService
            .updateFormasPagamento(result.form, element.id)
            .subscribe(
              (retorno) => {
                if (retorno) {
                  Swal.fire({
                    title: 'Sucesso!',
                    text: 'Forma de Pagamento atualizada com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3b2e37',
                    backdrop: false,
                  });
                  this.buscarFormasPagamento();
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

  public removerFormaPagamento(element) {
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
        this.formasPagamentoService.deleteFormasPagamento(element.id).subscribe(
          (retorno) => {
            if (retorno) {
              this.buscarFormasPagamento();
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
        this.formasPagamentoService.postFormasPagamentoExportacao().subscribe(
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
