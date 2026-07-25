import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';

import { ProgrammingComponent } from './programming.component';

describe('ProgrammingComponent', () => {
  let component: ProgrammingComponent;
  let fixture: ComponentFixture<ProgrammingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormsModule, MatIconModule, MatDividerModule, RouterTestingModule ],
      declarations: [ ProgrammingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgrammingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});