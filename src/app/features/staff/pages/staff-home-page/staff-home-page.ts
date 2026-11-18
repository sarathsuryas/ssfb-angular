import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff-home-page',
  imports: [RouterLink],
  templateUrl: './staff-home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffHomePage {}
