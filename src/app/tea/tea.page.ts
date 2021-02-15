import { Component, OnInit } from '@angular/core';
import { Tea } from '@app/models';
import { selectTeas, State } from '@app/store';
import { logout } from '@app/store/actions';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-tea',
  templateUrl: './tea.page.html',
  styleUrls: ['./tea.page.scss'],
})
export class TeaPage implements OnInit {
  teas$: Observable<Array<Array<Tea>>>;

  constructor(
    private navController: NavController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.teas$ = this.store
      .select(selectTeas)
      .pipe(map(teas => this.toMatrix(teas)));
  }

  logout() {
    this.store.dispatch(logout());
  }

  showDetailsPage(id: number) {
    this.navController.navigateForward(['tea-details', id]);
  }

  private toMatrix(teas: Array<Tea>): Array<Array<Tea>> {
    const matrix: Array<Array<Tea>> = [];
    let row = [];
    teas.forEach(t => {
      row.push(t);
      if (row.length === 4) {
        matrix.push(row);
        row = [];
      }
    });

    if (row.length) {
      matrix.push(row);
    }

    return matrix;
  }
}
