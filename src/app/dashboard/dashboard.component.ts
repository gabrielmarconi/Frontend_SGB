import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth-service/auth.service';
import { PermissionService } from '../service/permission-service/permission.service';
import Swal from 'sweetalert2';
import { AtualizarSenhaComponent } from '../shared/components/atualizar-senha/atualizar-senha.component';
import { RestorePasswordService } from '../service/restore-password-service/restore-password.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  title = 'front_sbg';
  showSidenav: boolean = false;
  @ViewChild('sidenav') sidenav: MatSidenav;

  //Aqui serão inseridos os objetos referente as páginas existentes p/ serem renderizados no menu lateral
  sidenavMenus = [
    {
      icon: 'insert_chart',
      label: 'Indicadores',
      route: 'indicadores',
      visible: localStorage.getItem('tipoUsuario') != 'C' ? true : false,
    },
    {
      icon: 'add_circle',
      label: 'Cadastros',
      route: '',
      subMenus: [
        {
          label: 'Clientes',
          icon: 'person',
          route: 'clientes',
          visible: true,
        },
        {
          label: 'Formas de Pagamento',
          icon: 'payment',
          route: 'formas-pagamento',
          visible: localStorage.getItem('tipoUsuario') != 'C' ? true : false,
        },
        {
          label: 'Funcionários',
          icon: 'people',
          route: 'funcionarios',
          visible: localStorage.getItem('tipoUsuario') == 'M' ? true : false,
        },
        {
          label: 'Serviços',
          icon: 'assignment',
          route: 'servicos',
          visible: localStorage.getItem('tipoUsuario') == 'M' ? true : false,
        },
      ],
      subMenuOpened: false,
    },
    {
      icon: 'content_cut',
      label: 'Atendimentos',
      route: 'atendimentos',
      visible: true,
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    public permissionService: PermissionService,
    public restorePasswordService: RestorePasswordService,
    public dialog: MatDialog
  ) {}

  isSidenavOpened(): boolean {
    return this.sidenav.opened;
  }

  ngOnInit() {
    if (localStorage.getItem('senhaProvisoria') == 'S')
      Swal.fire({
        title: 'A sua senha é provisória!',
        text: 'Para continuar, você deve atualizar sua senha, deseja fazer isso agora?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim!',
        confirmButtonColor: '#3b2e37',
        cancelButtonText: 'Não',
        backdrop: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.atualizarSenha(localStorage.getItem('idUsuario'));
        } else if (result.dismiss || result.isDismissed) {
          this.authService.logoff();
        }
      });
  }

  public atualizarSenha(idUsuario) {
    const dialogRef = this.dialog.open(AtualizarSenhaComponent, {
      width: '600px',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restorePasswordService.updatePassword(result, idUsuario).subscribe(
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
              localStorage.removeItem('senhaProvisoria');
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
            this.authService.logoff();
          }
        );
      }
    });
  }

  //Função responsável por abrir e fechar o menu lateral
  toggleSidenav(): void {
    if (this.isSidenavOpened()) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
  }

  logout(): void {
    Swal.fire({
      title: 'Tem certeza que deseja sair?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim!',
      confirmButtonColor: '#3b2e37',
      cancelButtonText: 'Não',
      backdrop: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logoff();
      }
    });
  }
  toggleSubMenu(menu: any): void {
    menu.subMenuOpened = !menu.subMenuOpened;
  }
}
