import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ClientesService } from 'src/app/dashboard/pages/clientes/shared/clientes.service';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { RestorePasswordService } from 'src/app/service/restore-password-service/restore-password.service';
import { AtualizarSenhaComponent } from 'src/app/shared/components/atualizar-senha/atualizar-senha.component';
import { RecuperarSenhaComponent } from 'src/app/shared/components/recuperar-senha/recuperar-senha.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public showPass: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    public titleService: Title,
    private dialog: MatDialog,
    public clienteService: ClientesService,
    private restorePasswordService: RestorePasswordService,
    private snackBar: MatSnackBar
  ) {}

  loginForm = new FormGroup({
    Login: new FormControl('', [Validators.required]),
    Senha: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.titleService.setTitle('SGB - Login');
  }

  fazerLogin(): void {
    this.authService
      .login(
        this.loginForm.get('Login').value,
        this.loginForm.get('Senha').value
      )
      .subscribe(
        (response) => {
          if (response) {
            // Armazene o token no sessionStorage ou em um serviço de estado
            const token = response.data.access_token;
            const idUsuario = response.data.idUsuario;
            const senhaProvisoria = response.data.senhaProvisoria;
            localStorage.setItem('idUsuario', idUsuario);
            localStorage.setItem('token', token);
            localStorage.setItem('senhaProvisoria', senhaProvisoria);
            if (token) {
              this.authService
                .getTipoUsuario(response.data.idUsuario)
                .subscribe((tipoUsuario: any) => {
                  if (tipoUsuario) {
                    localStorage.setItem('tipoUsuario', tipoUsuario.data);
                    if (tipoUsuario.data != 'C') {
                      this.router.navigate(['/dashboard/indicadores']);
                    } else {
                      this.router.navigate(['/dashboard/clientes']);
                      this.capturarIdCliente(idUsuario);
                    }
                  }

                  if (response.data.senhaProvisoria == 'S') {
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
                        this.atualizarSenha(response.data.idUsuario);
                      } else if (result.dismiss || result.isDismissed) {
                        this.authService.logoff();
                      }
                    });
                  }
                });
            }
          }
        },
        (error) => {
          Swal.fire({
            title: 'Erro!',
            text: 'E-mail ou senha errados!',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3b2e37',
          });
        }
      );
  }

  cadastrar(): void {
    this.router.navigate(['/cadastrar']);
  }

  public recuperarSenha(element: any = null, indexElement: number = null) {
    const dialogRef = this.dialog.open(RecuperarSenhaComponent, {
      width: '600px',
      height: 'auto',
      data: {
        element,
        indexElement,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restorePasswordService.postEsqueciSenha(result).subscribe(
          (retornoEsqueciSenha: any) => {
            if (retornoEsqueciSenha) {
              if (retornoEsqueciSenha.data[0].Registros[0].id) {
                this.restorePasswordService
                  .postEnviarEmail({
                    email: result.email,
                    emailConfirmacao: result.email,
                    idUsuario: retornoEsqueciSenha.data[0].Registros[0].id,
                  })
                  .subscribe(
                    (retornoEnvioEmail) => {
                      if (retornoEnvioEmail) {
                        Swal.fire({
                          title: 'Sucesso!',
                          text: 'E-mail para recuperação de conta enviado com sucesso!',
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
                        text: error.error.message[0],
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3b2e37',
                        backdrop: false,
                      });
                    }
                  );
              }
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

  public capturarIdCliente(idUsuario) {
    const query = `propertieName=id&propertieValue=${idUsuario}`;
    this.clienteService
      .getClientesRegistros(query)
      .subscribe((cliente: any) => {
        localStorage.setItem('idCliente', cliente.data[0].Registros[0].id);
      });
  }
}
