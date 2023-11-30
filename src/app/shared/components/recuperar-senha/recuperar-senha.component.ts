import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss'],
})
export class RecuperarSenhaComponent {
  constructor(
    public dialogRef: MatDialogRef<RecuperarSenhaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public showPass: boolean = false;
  recuperarSenhaForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    this.icon = 'settings_backup_restore';
    this.title = 'Recuperar Senha';
  }

  recuperarEmail(): void {
    this.dialogRef.close(this.recuperarSenhaForm.value);
  }

  fecharModal(): void {
    this.dialogRef.close();
  }
}
