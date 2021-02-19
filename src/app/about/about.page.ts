import { Component, OnInit } from '@angular/core';
import { State } from '@app/store';
import { logout } from '@app/store/actions';
import { Store } from '@ngrx/store';
import { author, description, name, version } from '../../../package.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  author: string;
  name: string;
  description: string;
  version: string;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.author = author;
    this.name = name;
    this.description = description;
    this.version = version;
  }

  logout() {
    this.store.dispatch(logout());
  }
}
