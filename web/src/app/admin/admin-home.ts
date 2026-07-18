import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  imports: [RouterLink],
  template: `
    <div class="admin-page">
      <h1>Administration</h1>
      <ul>
        <li><a routerLink="/admin/faq">Gérer la FAQ</a></li>
        <li><a routerLink="/admin/directory">Gérer l'annuaire</a></li>
        <li><a routerLink="/admin/campus-plan">Gérer le plan de campus</a></li>
      </ul>
    </div>
  `,
  styleUrl: './admin-page.scss',
})
export class AdminHome {}
