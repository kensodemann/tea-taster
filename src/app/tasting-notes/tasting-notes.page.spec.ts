import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TastingNote } from '@app/models';
import { selectNotes } from '@app/store';
import { notesPageLoaded } from '@app/store/actions';
import { DataState, initialState } from '@app/store/reducers/data.reducer';
import { IonicModule, IonRouterOutlet, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  createOverlayElementMock,
  createOverlayControllerMock,
} from '@test/mocks';
import { TastingNoteEditorComponent } from './tasting-note-editor/tasting-note-editor.component';
import { TastingNoteEditorModule } from './tasting-note-editor/tasting-note-editor.module';
import { TastingNotesPage } from './tasting-notes.page';

describe('TastingNotesPage', () => {
  let component: TastingNotesPage;
  let fixture: ComponentFixture<TastingNotesPage>;
  let modal: HTMLIonModalElement;
  let testData: Array<TastingNote>;

  const mockRouterOutlet = {
    nativeEl: {},
  };

  beforeEach(
    waitForAsync(() => {
      modal = createOverlayElementMock('Modal');
      initializeTestData();
      TestBed.configureTestingModule({
        declarations: [TastingNotesPage],
        imports: [IonicModule, TastingNoteEditorModule],
        providers: [
          {
            provide: ModalController,
            useFactory: () =>
              createOverlayControllerMock('ModalController', modal),
          },
          { provide: IonRouterOutlet, useValue: mockRouterOutlet },
          provideMockStore<{ data: DataState }>({
            initialState: { data: initialState },
          }),
        ],
      }).compileComponents();

      const store = TestBed.inject(Store) as MockStore;
      store.overrideSelector(selectNotes, testData);

      fixture = TestBed.createComponent(TastingNotesPage);
      component = fixture.componentInstance;
    }),
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('dispatches notes page loaded', () => {
      const store = TestBed.inject(Store);
      spyOn(store, 'dispatch');
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(notesPageLoaded());
    });

    it('displays the notes', () => {
      fixture.detectChanges();
      const items = fixture.debugElement.queryAll(By.css('ion-item'));
      expect(items.length).toEqual(2);
      expect(items[0].nativeElement.textContent).toContain('Bently');
      expect(items[1].nativeElement.textContent).toContain('Lipton');
    });
  });

  describe('add new note', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('creates the editor modal', () => {
      const modalController = TestBed.inject(ModalController);
      const button = fixture.debugElement.query(
        By.css('[data-testid="add-new-button"]'),
      ).nativeElement;
      click(button);
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: TastingNoteEditorComponent,
        backdropDismiss: false,
        swipeToClose: true,
        presentingElement: mockRouterOutlet.nativeEl as any,
      });
    });

    it('displays the editor modal', fakeAsync(() => {
      const button = fixture.debugElement.query(
        By.css('[data-testid="add-new-button"]'),
      ).nativeElement;
      click(button);
      tick();
      expect(modal.present).toHaveBeenCalledTimes(1);
    }));
  });

  describe('update an existing note', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('creates the editor modal', () => {
      const modalController = TestBed.inject(ModalController);
      const item = fixture.debugElement.query(By.css('ion-item')).nativeElement;
      click(item);
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: TastingNoteEditorComponent,
        backdropDismiss: false,
        swipeToClose: true,
        presentingElement: mockRouterOutlet.nativeEl as any,
        componentProps: { note: testData[0] },
      });
    });

    it('displays the editor modal', fakeAsync(() => {
      const item = fixture.debugElement.query(By.css('ion-item')).nativeElement;
      click(item);
      tick();
      expect(modal.present).toHaveBeenCalledTimes(1);
    }));
  });

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };

  const initializeTestData = () => {
    testData = [
      {
        id: 73,
        brand: 'Bently',
        name: 'Brown Label',
        notes: 'Essentially OK',
        rating: 3,
        teaCategoryId: 2,
      },
      {
        id: 42,
        brand: 'Lipton',
        name: 'Yellow Label',
        notes: 'Overly acidic, highly tannic flavor',
        rating: 1,
        teaCategoryId: 3,
      },
    ];
  };
});
