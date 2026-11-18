import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {
  protected readonly auth = inject(AuthService);

  protected logout(): void {
    this.auth.logout().subscribe();
  }
}
