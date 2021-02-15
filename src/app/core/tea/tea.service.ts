import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tea } from '@app/models';
import { Plugins } from '@capacitor/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeaService {
  private images: Array<string> = [
    'green',
    'black',
    'herbal',
    'oolong',
    'dark',
    'puer',
    'white',
    'yellow',
  ];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<Tea>> {
    return this.http
      .get(`${environment.dataService}/tea-categories`)
      .pipe(
        mergeMap((teas: Array<any>) =>
          Promise.all(teas.map(t => this.convert(t))),
        ),
      );
  }

  save(tea: Tea): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { Storage } = Plugins;
    return Storage.set({
      key: `rating${tea.id}`,
      value: tea.rating.toString(),
    });
  }

  private async convert(res: any): Promise<Tea> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { Storage } = Plugins;
    const rating = await Storage.get({ key: `rating${res.id}` });
    return {
      ...res,
      image: `assets/img/${this.images[res.id - 1]}.jpg`,
      rating: parseInt((rating && rating.value) || '0', 10),
    };
  }
}
