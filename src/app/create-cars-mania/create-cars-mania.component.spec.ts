import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCarsManiaComponent } from './create-cars-mania.component';

describe('CreateCarsManiaComponent', () => {
  let component: CreateCarsManiaComponent;
  let fixture: ComponentFixture<CreateCarsManiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCarsManiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarsManiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
