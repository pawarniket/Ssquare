import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDashboardComponent } from './sale-dashboard.component';

describe('SaleDashboardComponent', () => {
  let component: SaleDashboardComponent;
  let fixture: ComponentFixture<SaleDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaleDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
