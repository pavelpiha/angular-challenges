import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CitiesStore } from '../../data-access/city.store';
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { City } from '../../model/city.model';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card class="bg-light-red" [list]="cities" (clickAdd)="onAdd()">
      <img [alt]="imageSrc" [src]="imageSrc" width="200px" />
      <ng-template #rowRef let-city>
        <app-list-item (delete)="onDelete(city.id)">
          {{ city.name }}
        </app-list-item>
      </ng-template>
    </app-card>
  `,
  styles: [
    `
      .bg-light-red {
        background-color: rgba(250, 0, 0, 0.1);
      }
    `,
  ],
  standalone: true,
  imports: [CardComponent, ListItemComponent],
  encapsulation: ViewEncapsulation.None,
})
export class CityCardComponent implements OnInit {
  cities: City[] = [];
  imageSrc: string = 'assets/img/city.png';

  constructor(
    private http: FakeHttpService,
    private store: CitiesStore,
  ) {}

  ngOnInit(): void {
    this.http.fetchCities$.subscribe((e) => this.store.addAll(e));
    this.store.cities$.subscribe((e) => (this.cities = e));
  }

  onAdd(): void {
    this.store.addOne(randomCity());
  }

  onDelete(id: number): void {
    this.store.deleteOne(id);
  }
}
