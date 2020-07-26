import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
})
export class PrestamosComponent implements OnInit, AfterContentChecked {
  public readonly startDate = '2019-01-01';
  public readonly salarioQuincenal = 300;
  private readonly userRFC = 'BAGN900415TIA';
  public maxAmountAvailable = 0;
  public maxPeriods = 0;
  public readonly minAmountAvailable = this.salarioQuincenal * 0.1;
  public readonly minPeriods = 1;

  public readonly moment = moment;

  public loading = false;
  public status: string;

  public formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  });

  constructor(
    private readonly httpClient: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}
  public async ngOnInit(): Promise<void> {
    const years = this.moment().diff(this.startDate, 'years', true);
    if (years > 1) {
      switch (true) {
        case years > 1 && years <= 1.5:
          this.maxAmountAvailable = this.salarioQuincenal * 2;
          this.maxPeriods = 3;
          break;
        case years > 1.5 && years <= 2:
          this.maxAmountAvailable = this.salarioQuincenal * 4;
          this.maxPeriods = 4;
          break;
        case years > 2:
          this.maxAmountAvailable = this.salarioQuincenal * 6;
          this.maxPeriods = 6;
          break;
      }
      this.status = 'Available';
    } else {
      this.status = 'Not available';
    }
  }
  public ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  public getPeriodRange(dateRangeValue: number) {
    const value = (dateRangeValue / 100) * this.maxPeriods;
    return `${value} ${value > 1 ? 'Quincenas' : 'Quincena'}`;
  }
}
