import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CadastrosService } from './shared/cadastro.service';
import * as moment from 'moment';
import { ClientesService } from 'src/app/dashboard/pages/clientes/shared/clientes.service';
import { AuthService } from 'src/app/service/auth-service/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent {
  public showPass: boolean = false;

  constructor(
    private router: Router,
    private cadastroService: CadastrosService,
    private clienteService: ClientesService,
    public titleService: Title,
    private authService: AuthService
  ) {}

  cadastroForm = new FormGroup({
    id:  new FormControl([null]),
    nome: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    telefone: new FormControl(null),
    dataNascimento: new FormControl(null),
    administrador: new FormControl('N'),
  });

  ngOnInit() {
    this.titleService.setTitle('SGB - Cadastro');
  }

  public concluirCadastro(): void {
    if (this.cadastroForm.get('dataNascimento').value) {
      this.cadastroForm
        .get('dataNascimento')
        .setValue(
          moment
            .utc(this.cadastroForm.get('dataNascimento').value)
            .format('YYYY-MM-DDTHH:mm:SS') + 'Z'
        );
    }

    this.cadastroService.postCadastros(this.cadastroForm.value).subscribe(
      (cadastro: any) => {
        if (cadastro) {
          this.authService
            .login(
              this.cadastroForm.get('email').value,
              this.cadastroForm.get('senha').value
            )
            .subscribe((auth) => {
              if (auth) {
                const token = auth.data.access_token;
                const idUsuario = auth.data.idUsuario;
                localStorage.setItem('token', token);
                localStorage.setItem('idUsuario', idUsuario);
                if (token) {
                  this.clienteService
                    .postClientes({ idUsuario: cadastro.data.id })
                    .subscribe(
                      (response: any) => {
                        if (response) {
                          Swal.fire({
                            title: 'Sucesso!',
                            text: 'Cadastro realizado com sucesso!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#3b2e37',
                            backdrop: false,
                          });

                          this.authService
                            .getTipoUsuario(response.data.idUsuario)
                            .subscribe((tipoUsuario: any) => {
                              if (tipoUsuario) {
                                localStorage.setItem(
                                  'tipoUsuario',
                                  tipoUsuario.data
                                );
                                if (tipoUsuario.data != 'C')
                                  this.router.navigate([
                                    '/dashboard/indicadores',
                                  ]);
                                else
                                  this.router.navigate(['/dashboard/clientes']);
                              }
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

  public cancelarCadastro(): void {
    this.router.navigate(['/login']);
  }

  public getTipoUsuario() {}
}
