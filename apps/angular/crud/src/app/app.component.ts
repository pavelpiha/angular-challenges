import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { delay, of, pipe, switchMap, tap } from 'rxjs';
import { TodoDaoService } from './app.service';
import { TodoItem } from './todo-item.model';

interface TodoState {
  loading: boolean;
  error?: string;
  todos: TodoItem[];
}

@Component({
  standalone: true,
  imports: [CommonModule, NgIf, AsyncPipe, MatProgressSpinnerModule],
  selector: 'app-root',
  template: `
    <div class="app-spinner" *ngIf="loading$ | async">
      <mat-spinner diameter="50"></mat-spinner>
    </div>
    <div *ngFor="let todo of todos()">
      {{ todo.title }}
      <button (click)="onUpdate(todo)">Update</button>
      <button (click)="onDelete(todo)">Delete</button>
    </div>
  `,
  styles: [
    `
      .app-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends ComponentStore<TodoState> implements OnInit {
  readonly loading$ = this.select((s) => s.loading);
  readonly todos = this.selectSignal((s) => s.todos);
  readonly error$ = this.select((s) => s.error);

  constructor(public todoDaoService: TodoDaoService) {
    super({ loading: false, todos: [] });
  }

  ngOnInit(): void {
    this.loadData(of([]));
  }

  onUpdate(item: TodoItem) {
    this.updateStore({ item });
  }

  onDelete(item: TodoItem) {
    this.updateStoreOnRemove({ item });
  }

  private loadData = this.effect(
    pipe(
      tap(() => this.patchState({ loading: true, todos: [] })),
      switchMap(() =>
        this.todoDaoService.get().pipe(
          delay(500),
          tapResponse(
            (data) => this.patchState({ todos: data, loading: false }),
            (err) => this.patchState({ error: err as string, loading: false }),
          ),
        ),
      ),
    ),
  );

  private updateStore = this.effect<{
    item: TodoItem;
  }>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(({ item }) =>
        this.todoDaoService.update(item).pipe(
          tapResponse(
            (updatedItem) => this.updateItems(updatedItem),
            (err) => this.patchState({ error: err as string, loading: false }),
          ),
        ),
      ),
    ),
  );

  private updateItems = this.updater((state, updatedItem: TodoItem) => {
    const newItems = [...state.todos].map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
    return {
      ...state,
      loading: false,
      todos: newItems,
    };
  });

  private updateStoreOnRemove = this.effect<{
    item: TodoItem;
  }>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(({ item }) =>
        this.todoDaoService.delete(item).pipe(
          tapResponse(
            () => this.removeItem(item),
            (err) => this.patchState({ error: err as string, loading: false }),
          ),
        ),
      ),
    ),
  );

  private removeItem = this.updater((state, removedItem: TodoItem) => {
    const newItems = [...state.todos].filter(
      (item) => item.id !== removedItem.id,
    );
    return {
      ...state,
      loading: false,
      todos: newItems,
    };
  });
}
