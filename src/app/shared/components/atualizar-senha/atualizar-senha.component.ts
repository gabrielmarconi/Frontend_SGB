import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-atualizar-senha',
  templateUrl: './atualizar-senha.component.html',
  styleUrls: ['./atualizar-senha.component.scss'],
})
export class AtualizarSenhaComponent {
  constructor(
    public dialogRef: MatDialogRef<AtualizarSenhaComponent>,
    public authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public showPassAtual: boolean = false;
  public showPassNew: boolean = false;
  public showPassConfirm: boolean = false;

  atualizarSenhaForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    senhaAtual: new FormControl(null, [Validators.required]),
    novaSenha: new FormControl(null, [Validators.required]),
    confirmarSenha: new FormControl(null, [Validators.required]),
  });

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    this.icon = 'settings_backup_restore';
    this.title = 'Atualizar Senha';
  }

  recuperarEmail(): void {
    this.dialogRef.close(this.atualizarSenhaForm.value);
  }

  fecharModal(): void {
    this.dialogRef.close();
    if (!this.data.element) this.authService.logoff();
  }

  conferirSenhaCompativeis(): void {
    if (
      this.atualizarSenhaForm.get('novaSenha').value !==
      this.atualizarSenhaForm.get('confirmarSenha').value
    ) {
      Swal.fire({
        title: 'As senhas não estão compatíveis!',
        text: 'Confira se as duas senhas são iguais',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b2e37',
        backdrop: false,
      });
    } else {
      this.recuperarEmail();
    }
  }
}
