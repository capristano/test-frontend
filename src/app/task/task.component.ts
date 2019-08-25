import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TaskService } from '../common/service/task.service';
import { Task } from './task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskComponent implements OnInit {

  @ViewChild('drawerData', { static: false }) drawerData: NzDrawerRef<any>;

  // inicialização do form
  taskForm = this.formBuilder.group({
    id: new FormControl(null),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    status: new FormControl('1', Validators.required),
    dateChange: new FormControl({value: '', disabled: true})
  });

  // lista com todas as tarefas
  all = [];
  // listas específicas por status, auxiliam na exibição das tarefas por coluna de status
  todo = [];
  doing = [];
  done = [];

  // variável utilizada no modal de exclusão, define a visibilidade do mesmo
  isVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private taskSerive: TaskService
  ) { }

  ngOnInit() {
    this.findAll();
  }

  // busca todas as tarefas
  findAll() {
    this.taskSerive.findAll().subscribe(res => {
      res.forEach(task => {
        this.all.push(task);
        this.updateAuxLists();
      });
    }, err => {
      console.log(err);
    });
  }

  // atualiza as listas auxiliares
  updateAuxLists() {
    this.todo = this.all.filter(item => item.status === 1);
    this.doing = this.all.filter(item => item.status === 2);
    this.done = this.all.filter(item => item.status === 3);
  }

  // limpa o form
  clearForm() {
    this.taskForm.reset();
    this.taskForm.get('status').setValue('1');
    this.taskForm.get('dateChange').setValue(this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss'));
  }

  // abre a sidebar para inclusão de tarefa
  addTask() {
    this.clearForm();
    this.drawerData.open();
  }

  // abre a sidebar para alteração de tarefa
  onItemClick(item) {
    this.taskForm.get('id').setValue(item.id);
    this.taskForm.get('title').setValue(item.title);
    this.taskForm.get('description').setValue(item.description);
    this.taskForm.get('status').setValue(item.status.toString());
    this.taskForm.get('dateChange').setValue(item.dateChange);
    this.drawerData.open();
  }

  // atualiza o status de uma tarefa movida de coluna
  onChangeStatus(value) {
    value.item.status = value.status;
    value.item.dateChange = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');

    this.taskSerive.save(value.item).subscribe(() => {}, err => {
      console.log(err);
    });
  }

  // exibe o modal que confirma a exclusão de registro
  showModal(): void {
    this.isVisible = true;
  }

  // ação ao confirmar exclusão de registro
  handleOk(): void {
    this.isVisible = false;
    const id = this.taskForm.get('id').value;
    const status = this.taskForm.get('status').value;

    if (id != null) {
      this.taskSerive.delete(id).subscribe(() => {}, err => {
        console.log(err);
      });
      this.all = this.all.filter(item => item.id !== id);
      this.updateAuxLists();
    }

    this.clearForm();
    this.onCloseDrawerData();
  }

  // ação ao cancelar a exclusão de registro
  handleCancel(): void {
    this.isVisible = false;
  }

  // ação de exclusão de registro
  onDelete() {
    this.showModal();
  }

  // salva registros em modo de inclusão ou alteração
  onSave() {
    const id = this.taskForm.get('id').value;
    const task = new Task (
      this.taskForm.get('title').value,
      this.taskForm.get('description').value,
      parseInt(this.taskForm.get('status').value, 0)
    );
    if (id !== null) {
      task.id = parseInt(id, 0);
      task.dateChange = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
      const itemIndex = this.all.findIndex(item => item.id === task.id);
      this.all[itemIndex] = task;
    } else {
      task.dateCreation = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
      this.taskSerive.save(task).subscribe(serverId => {
        task.id = serverId;
      }, err => {
        console.log(err);
      });
      this.all.push(task);
    }
    this.updateAuxLists();
    this.clearForm();
    this.onCloseDrawerData();
  }

  // fecha a sidebar
  onCloseDrawerData() {
    this.drawerData.close();
  }

}
