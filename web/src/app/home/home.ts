import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { AppIcon } from '../shared/icon/icon';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AppIcon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly authService = inject(AuthService);
}
