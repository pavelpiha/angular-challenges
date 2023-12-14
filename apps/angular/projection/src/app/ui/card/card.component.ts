/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  standalone: true,
  imports: [NgIf, NgFor, ListItemComponent, NgTemplateOutlet],
  host: {
    class: 'border-2 border-black rounded-md p-4 w-fit flex flex-col gap-3',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent<T> {
  @Input() list: T[] | null = null;

  @Output() clickAdd: EventEmitter<void> = new EventEmitter();

  @ContentChild('rowRef', { read: TemplateRef }) rowTemplate!: TemplateRef<{
    $implicit: T;
  }>;

  addNewItem(): void {
    this.clickAdd.emit();
  }
}
