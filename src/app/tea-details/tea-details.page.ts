import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tea } from '@app/models';
import { selectTea, State } from '@app/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tea-details',
  templateUrl: './tea-details.page.html',
  styleUrls: ['./tea-details.page.scss'],
})
export class TeaDetailsPage implements OnInit {
  tea$: Observable<Tea>;

  constructor(private route: ActivatedRoute, private store: Store<State>) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.tea$ = this.store.select(selectTea, { id });
  }
}
