import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-adicionar-cliente',
  templateUrl: './adicionar-cliente.component.html',
  styleUrls: ['./adicionar-cliente.component.scss'],
})
export class AdicionarClienteComponent {
  constructor(
    public dialogRef: MatDialogRef<AdicionarClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public showPass: boolean = false;

  clientesForm = new FormGroup({
    id: new FormControl(null),
    idUsuario: new FormControl(null),
    email: new FormControl(null),
    dataNascimento: new FormControl(null),
    nome: new FormControl(null, [Validators.required]),
    telefone: new FormControl(null),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    administrador: new FormControl('N'),
  });

  isEdit = new FormControl(false);

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    if (this.data.element) {
      if (this.data.element.dataNascimento) {
        this.data.element.dataNascimento = moment(
          this.data.element.dataNascimento
        ).format('YYYY-MM-DD');
      }
      this.icon = 'edit';
      this.title = 'Editar Cliente';
      this.clientesForm.patchValue(this.data.element);
      this.isEdit.setValue(true);
    } else {
      this.icon = 'add';
      this.title = 'Adicionar Cliente';
    }
  }

  adicionarCliente(): void {
    this.dialogRef.close({
      form: this.clientesForm.value,
      edit: this.isEdit.value,
    });
  }

  fecharModal(): void {
    this.dialogRef.close();
  }
}
