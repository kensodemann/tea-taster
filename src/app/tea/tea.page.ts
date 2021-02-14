import { Component, OnInit } from '@angular/core';

import { Tea } from '@app/models';

@Component({
  selector: 'app-tea',
  templateUrl: './tea.page.html',
  styleUrls: ['./tea.page.scss'],
})
export class TeaPage implements OnInit {
  get teaMatrix(): Array<Array<Tea>> {
    return this.toMatrix(this.teaData);
  }

  private teaData: Array<Tea> = [
    {
      id: 1,
      name: 'Green',
      image: 'assets/img/green.jpg',
      description:
        'Green teas have the oxidation process stopped very early on, leaving them with a very subtle flavor and ' +
        'complex undertones. These teas should be steeped at lower temperatures for shorter periods of time.',
    },
    {
      id: 2,
      name: 'Black',
      image: 'assets/img/black.jpg',
      description:
        'A fully oxidized tea, black teas have a dark color and a full robust and pronounced flavor. Blad teas tend ' +
        'to have a higher caffeine content than other teas.',
    },
    {
      id: 3,
      name: 'Herbal',
      image: 'assets/img/herbal.jpg',
      description:
        'Herbal infusions are not actually "tea" but are more accurately characterized as infused beverages ' +
        'consisting of various dried herbs, spices, and fruits.',
    },
    {
      id: 4,
      name: 'Oolong',
      image: 'assets/img/oolong.jpg',
      description:
        'Oolong teas are partially oxidized, giving them a flavor that is not as robust as black teas but also ' +
        'not as suble as green teas. Oolong teas often have a flowery fragrance.',
    },
    {
      id: 5,
      name: 'Dark',
      image: 'assets/img/dark.jpg',
      description:
        'From the Hunan and Sichuan provinces of China, dark teas are flavorful aged probiotic teas that steeps ' +
        'up very smooth with slightly sweet notes.',
    },
    {
      id: 6,
      name: 'Puer',
      image: 'assets/img/puer.jpg',
      description:
        'An aged black tea from china. Puer teas have a strong rich flavor that could be described as "woody" or "peaty."',
    },
    {
      id: 7,
      name: 'White',
      image: 'assets/img/white.jpg',
      description:
        'White tea is produced using very young shoots with no oxidation process. White tea has an extremely ' +
        'delicate flavor that is sweet and fragrent. White tea should be steeped at lower temperatures for ' +
        'short periods of time.',
    },
  ];

  constructor() {}

  ngOnInit() {}

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
