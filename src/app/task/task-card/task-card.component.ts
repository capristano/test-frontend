import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ListEnum } from 'src/app/common/enum/list.enum';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit {

  @Input() title: string;
  @Input() listName: string;
  @Input() list: any[];
  @Input() connection: any[];
  @Output() itemClick = new EventEmitter();
  @Output() changeStatus = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  // ação de click no card
  onClick(item) {
    this.itemClick.emit(item);
  }

  // ação ao soltar o card em nova coluna
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        this.changeStatus.emit({
          item: event.container.data[event.currentIndex],
          status: ListEnum[event.container.id]
        });
    }
  }

}
