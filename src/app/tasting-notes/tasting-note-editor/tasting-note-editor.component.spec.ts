import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SharedModule } from '@app/shared';
import { selectTeas } from '@app/store';
import { noteSaved } from '@app/store/actions';
import { DataState, initialState } from '@app/store/reducers/data.reducer';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createOverlayControllerMock } from '@test/mocks';
import { TastingNoteEditorComponent } from './tasting-note-editor.component';

describe('TastingNoteEditorComponent', () => {
  let component: TastingNoteEditorComponent;
  let fixture: ComponentFixture<TastingNoteEditorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TastingNoteEditorComponent],
        imports: [FormsModule, IonicModule, SharedModule],
        providers: [
          provideMockStore<{ data: DataState }>({
            initialState: { data: initialState },
          }),
          {
            provide: ModalController,
            useFactory: () => createOverlayControllerMock('ModalController'),
          },
        ],
      }).compileComponents();

      const store = TestBed.inject(Store) as MockStore;
      store.overrideSelector(selectTeas, [
        {
          id: 7,
          name: 'White',
          image: 'assets/img/white.jpg',
          description: 'White tea description.',
          rating: 5,
        },
        {
          id: 8,
          name: 'Yellow',
          image: 'assets/img/yellow.jpg',
          description: 'Yellow tea description.',
          rating: 3,
        },
      ]);

      fixture = TestBed.createComponent(TastingNoteEditorComponent);
      component = fixture.componentInstance;
    }),
  );

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('binds the tea select', () => {
      fixture.detectChanges();
      const sel = fixture.debugElement.query(By.css('ion-select'));
      const opts = sel.queryAll(By.css('ion-select-option'));
      expect(opts[0].nativeElement.value).toEqual('7');
      expect(opts[0].nativeElement.textContent).toEqual('White');
      expect(opts[1].nativeElement.value).toEqual('8');
      expect(opts[1].nativeElement.textContent).toEqual('Yellow');
    });

    describe('without a note', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('has the add title', () => {
        const el = fixture.debugElement.query(By.css('ion-title'));
        expect(el.nativeElement.textContent).toEqual('Add New Tasting Note');
      });

      it('has the add button label', () => {
        const footer = fixture.debugElement.query(By.css('ion-footer'));
        const el = footer.query(By.css('ion-button'));
        expect(el.nativeElement.textContent).toEqual('Add');
      });
    });

    describe('with a note', () => {
      beforeEach(() => {
        component.note = {
          id: 7,
          brand: 'Lipton',
          name: 'Yellow Label',
          notes: 'Overly acidic, highly tannic flavor',
          rating: 1,
          teaCategoryId: 3,
        };
        fixture.detectChanges();
      });

      it('sets the properties', () => {
        expect(component.brand).toEqual('Lipton');
        expect(component.name).toEqual('Yellow Label');
        expect(component.notes).toEqual('Overly acidic, highly tannic flavor');
        expect(component.rating).toEqual(1);
        expect(component.teaCategoryId).toEqual('3');
      });

      it('has the update title', () => {
        const el = fixture.debugElement.query(By.css('ion-title'));
        expect(el.nativeElement.textContent).toEqual('Tasting Note');
      });

      it('has the update button label', () => {
        const footer = fixture.debugElement.query(By.css('ion-footer'));
        const el = footer.query(By.css('ion-button'));
        expect(el.nativeElement.textContent).toEqual('Update');
      });
    });
  });

  describe('save', () => {
    describe('a new note', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('dispatches the save with the data', () => {
        const store = TestBed.inject(Store);
        spyOn(store, 'dispatch');
        component.brand = 'Lipton';
        component.name = 'Yellow Label';
        component.teaCategoryId = '3';
        component.rating = 1;
        component.notes = 'ick';
        component.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          noteSaved({
            note: {
              brand: 'Lipton',
              name: 'Yellow Label',
              teaCategoryId: 3,
              rating: 1,
              notes: 'ick',
            },
          }),
        );
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe('an existing note', () => {
      beforeEach(() => {
        component.note = {
          id: 73,
          brand: 'Generic',
          name: 'White Label',
          teaCategoryId: 2,
          rating: 3,
          notes: 'it is ok',
        };
        fixture.detectChanges();
      });

      it('dispatches the save with the data', () => {
        const store = TestBed.inject(Store);
        spyOn(store, 'dispatch');
        component.brand = 'Lipton';
        component.name = 'Yellow Label';
        component.teaCategoryId = '3';
        component.rating = 1;
        component.notes = 'ick';
        component.save();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          noteSaved({
            note: {
              id: 73,
              brand: 'Lipton',
              name: 'Yellow Label',
              teaCategoryId: 3,
              rating: 1,
              notes: 'ick',
            },
          }),
        );
      });

      it('dismisses the modal', () => {
        const modalController = TestBed.inject(ModalController);
        component.save();
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('close', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('dismisses the modal', () => {
      const modalController = TestBed.inject(ModalController);
      component.close();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
