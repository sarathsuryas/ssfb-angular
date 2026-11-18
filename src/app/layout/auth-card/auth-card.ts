import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-card',
  templateUrl: './auth-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCard {}
