import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { randText } from '@ngneat/falso';
import { Observable } from 'rxjs';
import { TodoItem } from './todo-item.model';

@Injectable({ providedIn: 'root' })
export class TodoDaoService {
  readonly URL = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  get(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.URL);
  }

  update(todo: TodoItem): Observable<TodoItem> {
    return this.http.put<TodoItem>(
      `${this.URL}/${todo.id}`,
      JSON.stringify({
        todo: todo.id,
        title: randText(),
        body: todo.body,
        userId: todo.userId,
      }),
      {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );
  }

  delete(todo: TodoItem): Observable<TodoItem> {
    return this.http.delete<TodoItem>(`${this.URL}/${todo.id}`);
  }
}
