import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-adicionar-servico',
  templateUrl: './adicionar-servico.component.html',
  styleUrls: ['./adicionar-servico.component.scss'],
})
export class AdicionarServicoComponent {
  constructor(
    public dialogRef: MatDialogRef<AdicionarServicoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  servicosForm = new FormGroup({
    descricao: new FormControl(null, [Validators.required]),
    valor: new FormControl(null, [Validators.required]),
    duracao: new FormControl(null, [Validators.required]),
    ativo: new FormControl('N', [Validators.required]),
  });

  isEdit = new FormControl(false);

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    if (this.data.element) {
      this.icon = 'edit';
      this.title = 'Editar Serviço';
      this.servicosForm.patchValue(this.data.element);
      this.isEdit.setValue(true);
    } else {
      this.icon = 'add';
      this.title = 'Adicionar Serviço';
    }
  }

  adicionarServico(): void {
    this.servicosForm
      .get('duracao')
      .setValue(+this.servicosForm.get('duracao').value);
    this.dialogRef.close({
      form: this.servicosForm.value,
      edit: this.isEdit.value,
    });
  }

  fecharModal(): void {
    this.dialogRef.close();
  }

  public setCheckbox(event: any, campo: string): void {
    event.checked
      ? this.servicosForm.get(campo).setValue('S')
      : this.servicosForm.get(campo).setValue('N');
  }
}
