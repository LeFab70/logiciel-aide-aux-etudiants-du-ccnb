import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../shared/icon/icon';

@Component({
  selector: 'app-admin-home',
  imports: [RouterLink, AppIcon],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <span class="page-icon"><app-icon name="shield-check" [size]="24" /></span>
        <div>
          <h1>Administration</h1>
          <p>Gère le contenu affiché aux étudiants de chaque campus.</p>
        </div>
      </header>

      <div class="card-grid">
        <a class="admin-nav-card" routerLink="/admin/faq">
          <span class="card-icon icon-blue"><app-icon name="circle-question-mark" [size]="22" /></span>
          <div>
            <h3>FAQ</h3>
            <p>Ajouter, modifier ou supprimer des questions fréquentes</p>
          </div>
        </a>
        <a class="admin-nav-card" routerLink="/admin/directory">
          <span class="card-icon icon-purple"><app-icon name="users" [size]="22" /></span>
          <div>
            <h3>Annuaire</h3>
            <p>Gérer les contacts et personnes-ressources</p>
          </div>
        </a>
        <a class="admin-nav-card" routerLink="/admin/campus-plan">
          <span class="card-icon icon-green"><app-icon name="map" [size]="22" /></span>
          <div>
            <h3>Plan de campus</h3>
            <p>Mettre à jour l'image et les points d'intérêt</p>
          </div>
        </a>
      </div>
    </div>
  `,
  styleUrl: './admin-page.scss',
})
export class AdminHome {}
