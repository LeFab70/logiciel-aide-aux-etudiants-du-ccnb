import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { CampusPlanService } from '../../core/campus-plan.service';
import { CampusPlan, PlanPoint, PlanPointCategory } from '../../core/models';
import { AppIcon } from '../../shared/icon/icon';

const CATEGORY_ICONS: Record<PlanPointCategory, string> = {
  CLASSROOM: 'building-2',
  SERVICE: 'shield-check',
  CAFETERIA: 'utensils',
  LIBRARY: 'book-open',
  OTHER: 'map-pin',
};

@Component({
  selector: 'app-campus-plan-view',
  imports: [AppIcon],
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

  iconFor(category: PlanPointCategory): string {
    return CATEGORY_ICONS[category] ?? 'map-pin';
  }
}
