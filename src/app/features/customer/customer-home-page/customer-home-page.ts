import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-customer-home-page',
  templateUrl: './customer-home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerHomePage {}
