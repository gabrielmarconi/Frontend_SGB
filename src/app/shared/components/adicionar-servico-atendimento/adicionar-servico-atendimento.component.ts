import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject, startWith, takeUntil } from 'rxjs';
import { ServicosService } from 'src/app/dashboard/pages/servicos/shared/servicos.service';

@Component({
  selector: 'app-adicionar-servico-atendimento',
  templateUrl: './adicionar-servico-atendimento.component.html',
  styleUrls: ['./adicionar-servico-atendimento.component.scss'],
})
export class AdicionarServicoAtendimentoComponent {
  constructor(
    public dialogRef: MatDialogRef<AdicionarServicoAtendimentoComponent>,
    public servicosService: ServicosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  protected servicos: Array<any>;

  protected _onDestroy = new Subject<void>();

  public filteredServicos: ReplaySubject<Array<any>> = new ReplaySubject<
    Array<any>
  >(1);

  servicoFilterCtrl = new FormControl(null);

  servicosForm = new FormGroup({
    idAtendimento: new FormControl(null),
    idServico: new FormControl(null, [Validators.required]),
    descricao: new FormControl(null),
    valor: new FormControl(null),
    duracao: new FormControl(null),
  });

  isEdit = new FormControl(false);

  icon: string = '';
  title: string = '';
  buttonTitle: string = '';

  ngOnInit() {
    this.servicosService.getServicos().subscribe((servicos: any) => {
      if (servicos) {
        this.servicos = servicos.data;
        this.servicoFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy), startWith(''))
          .subscribe(() => {
            this.filterServicos();
          });
      }
    });

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
    const dadosServico = this.servicos.find(
      (servico) => servico.id == this.servicosForm.get('idServico').value
    );

    this.servicosForm.get('descricao').setValue(dadosServico.descricao);
    this.servicosForm.get('duracao').setValue(dadosServico.duracao);
    this.servicosForm.get('valor').setValue(dadosServico.valor);
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

  protected filterServicos() {
    if (!this.servicos) {
      return;
    }
    let search = this.servicoFilterCtrl.value;
    if (!search) {
      this.filteredServicos.next(this.servicos.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredServicos.next(
      this.servicos.filter(
        (servico) => servico.descricao.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
