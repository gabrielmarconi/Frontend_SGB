import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import descriptografar from '../../routines/descriptografar';
import criptografar from '../../routines/criptografar';

@Component({
  selector: 'app-adicionar-funcionario',
  templateUrl: './adicionar-funcionario.component.html',
  styleUrls: ['./adicionar-funcionario.component.scss'],
})
export class AdicionarFuncionarioComponent {
  constructor(
    public dialogRef: MatDialogRef<AdicionarFuncionarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public showPass: boolean = false;

  desabilitarCheckboxAdm: boolean = true;

  funcionariosForm = new FormGroup({
    id: new FormControl(null),
    idUsuario: new FormControl(null),
    email: new FormControl(null),
    dataNascimento: new FormControl(null),
    nome: new FormControl(null, [Validators.required]),
    telefone: new FormControl(null),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    horaInicioExpediente: new FormControl(null, [Validators.required]),
    horaTerminoExpediente: new FormControl(null, [Validators.required]),
    administrador: new FormControl('N'),
    SMTPHost: new FormControl(null),
    SMTPRemetente: new FormControl(null),
    SMTPPort: new FormControl(null),
    SMTPUsuario: new FormControl(null),
    SMTPSenha: new FormControl(null),
    SMTPTimeout: new FormControl(null),
    SMTPConexaoSegura: new FormControl('N'),
  });

  isEdit = new FormControl(false);

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    if (this.data.element) {
      if (this.data.element.administrador == 'N') {
        this.desabilitarCheckboxAdm = this.validarAdmExistente(
          this.data.dataSource
        );
      } else {
        this.desabilitarCheckboxAdm = false;
      }
      if (this.data.element.dataNascimento) {
        this.data.element.dataNascimento = moment(
          this.data.element.dataNascimento
        ).format('YYYY-MM-DD');
      }
      if (this.data.element.SMTPSenha) {
        this.data.element.SMTPSenha = descriptografar(
          this.data.element.SMTPSenha
        );
      }

      if (this.data.element.horaInicioExpediente) {
        this.data.element.horaInicioExpediente =
          this.data.element.horaInicioExpediente.slice(0, 2) +
          ':' +
          this.data.element.horaInicioExpediente.slice(2);
      }

      if (this.data.element.horaTerminoExpediente) {
        this.data.element.horaTerminoExpediente =
          this.data.element.horaTerminoExpediente.slice(0, 2) +
          ':' +
          this.data.element.horaTerminoExpediente.slice(2);
      }
      this.icon = 'edit';
      this.title = 'Editar Funcionário';
      this.funcionariosForm.patchValue(this.data.element);
      this.isEdit.setValue(true);
    } else {
      this.icon = 'add';
      this.title = 'Adicionar Funcionário';
      this.desabilitarCheckboxAdm = this.validarAdmExistente(
        this.data.dataSource
      );
    }
  }

  adicionarFuncionario(): void {
    this.funcionariosForm
      .get('horaInicioExpediente')
      .setValue(
        this.funcionariosForm
          .get('horaInicioExpediente')
          .value.replace(/:/g, '')
      );
    this.funcionariosForm
      .get('horaTerminoExpediente')
      .setValue(
        this.funcionariosForm
          .get('horaTerminoExpediente')
          .value.replace(/:/g, '')
      );
    this.dialogRef.close({
      form: this.funcionariosForm.value,
      edit: this.isEdit.value,
    });
  }

  fecharModal(): void {
    if (this.data?.element?.SMTPSenha) {
      this.data.element.SMTPSenha = criptografar(this.data.element.SMTPSenha);
    }
    this.dialogRef.close();
  }

  public setCheckbox(event: any, campo: string): void {
    if (event.checked) {
      this.funcionariosForm.get(campo).setValue('S');
    } else {
      this.funcionariosForm.get(campo).setValue('N');
      this.funcionariosForm.get('SMTPHost').setValue(null);
      this.funcionariosForm.get('SMTPRemetente').setValue(null);
      this.funcionariosForm.get('SMTPPort').setValue(null);
      this.funcionariosForm.get('SMTPUsuario').setValue(null);
      this.funcionariosForm.get('SMTPSenha').setValue(null);
      this.funcionariosForm.get('SMTPTimeout').setValue(null);
      this.funcionariosForm.get('SMTPConexaoSegura').setValue('N');
    }
  }

  public validarAdmExistente(data): boolean {
    return data.some((registro) => registro.administrador == 'S');
  }
}
