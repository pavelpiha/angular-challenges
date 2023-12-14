import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { City } from '../model/city.model';

@Injectable({
  providedIn: 'root',
})
export class CitiesStore {
  private cities = new BehaviorSubject<City[]>([]);
  cities$ = this.cities.asObservable();

  addAll(cities: City[]) {
    this.cities.next(cities);
  }

  addOne(cities: City) {
    this.cities.next([...this.cities.value, cities]);
  }

  deleteOne(id: number) {
    this.cities.next(this.cities.value.filter((t) => t.id !== id));
  }
}
