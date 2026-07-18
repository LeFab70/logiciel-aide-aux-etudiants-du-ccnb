import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { CampusPlanService } from '../../core/campus-plan.service';
import { CampusPlan, PlanPoint } from '../../core/models';

@Component({
  selector: 'app-campus-plan-view',
  templateUrl: './campus-plan-view.html',
  styleUrl: './campus-plan-view.scss',
})
export class CampusPlanView {
  private readonly campusPlanService = inject(CampusPlanService);
  private readonly authService = inject(AuthService);

  readonly plan = signal<CampusPlan | null>(null);
  readonly selectedPoint = signal<PlanPoint | null>(null);
  readonly notFound = signal(false);

  constructor() {
    const campusId = this.authService.currentUser()?.campus.id;
    if (campusId) {
      this.campusPlanService.get(campusId).subscribe({
        next: (plan) => this.plan.set(plan),
        error: () => this.notFound.set(true),
      });
    }
  }

  selectPoint(point: PlanPoint): void {
    this.selectedPoint.set(point);
  }
}
