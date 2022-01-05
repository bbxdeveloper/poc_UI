import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumReportDateIntervalDialogComponent } from './sum-report-date-interval-dialog.component';

describe('SumReportDateIntervalDialogComponent', () => {
  let component: SumReportDateIntervalDialogComponent;
  let fixture: ComponentFixture<SumReportDateIntervalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SumReportDateIntervalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SumReportDateIntervalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
