import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { CampusPlanService } from '../../core/campus-plan.service';
import { CampusService } from '../../core/campus.service';
import { Campus, CampusPlan, PlanPoint, PlanPointCategory } from '../../core/models';
import { CrudColumn, CrudTable } from '../../shared/crud-table/crud-table';
import { CrudField } from '../../shared/crud-table/crud-field';
import { AppIcon } from '../../shared/icon/icon';

const POINT_CATEGORIES: PlanPointCategory[] = [
  'CLASSROOM',
  'SERVICE',
  'CAFETERIA',
  'LIBRARY',
  'OTHER',
];

@Component({
  selector: 'app-campus-plan-admin',
  imports: [CrudTable, FormsModule, AppIcon],
  templateUrl: './campus-plan-admin.html',
  styleUrl: '../admin-page.scss',
})
export class CampusPlanAdmin {
  private readonly campusPlanService = inject(CampusPlanService);
  private readonly campusService = inject(CampusService);
  private readonly authService = inject(AuthService);

  readonly campuses = signal<Campus[]>([]);
  readonly selectedCampusId = signal<number | null>(null);
  readonly plan = signal<CampusPlan | null>(null);
  readonly imageUrl = signal('');
  readonly description = signal('');

  readonly pointFields: CrudField[] = [
    { key: 'label', label: 'Nom', type: 'text', required: true },
    { key: 'xPercent', label: 'Position X (%)', type: 'number', required: true },
    { key: 'yPercent', label: 'Position Y (%)', type: 'number', required: true },
    {
      key: 'category',
      label: 'Catégorie',
      type: 'select',
      required: true,
      options: POINT_CATEGORIES.map((c) => ({ value: c, label: c })),
    },
    { key: 'description', label: 'Description', type: 'textarea' },
  ];

  readonly pointColumns: CrudColumn[] = [
    { key: 'label', label: 'Nom' },
    { key: 'category', label: 'Catégorie' },
  ];

  constructor() {
    this.selectedCampusId.set(this.authService.currentUser()?.campus.id ?? null);
    this.campusService.list().subscribe((campuses) => {
      this.campuses.set(campuses);
      this.reload();
    });
  }

  selectCampus(campusId: number): void {
    this.selectedCampusId.set(campusId);
    this.reload();
  }

  private reload(): void {
    const campusId = this.selectedCampusId();
    if (campusId === null) {
      return;
    }
    this.campusPlanService.get(campusId).subscribe({
      next: (plan) => {
        this.plan.set(plan);
        this.imageUrl.set(plan.imageUrl ?? '');
        this.description.set(plan.description ?? '');
      },
      error: () => {
        this.plan.set(null);
        this.imageUrl.set('');
        this.description.set('');
      },
    });
  }

  saveDetails(): void {
    const campusId = this.selectedCampusId();
    if (campusId === null) {
      return;
    }
    this.campusPlanService
      .upsert(campusId, { imageUrl: this.imageUrl() || null, description: this.description() || null })
      .subscribe(() => this.reload());
  }

  onCreatePoint(value: Record<string, unknown>): void {
    const campusId = this.selectedCampusId();
    if (campusId === null) {
      return;
    }
    this.campusPlanService
      .addPoint(campusId, value as unknown as Omit<PlanPoint, 'id'>)
      .subscribe(() => this.reload());
  }

  onUpdatePoint(event: { id: number; value: Record<string, unknown> }): void {
    const campusId = this.selectedCampusId();
    if (campusId === null) {
      return;
    }
    this.campusPlanService
      .updatePoint(campusId, event.id, event.value as unknown as Omit<PlanPoint, 'id'>)
      .subscribe(() => this.reload());
  }

  onDeletePoint(id: number): void {
    const campusId = this.selectedCampusId();
    if (campusId === null) {
      return;
    }
    this.campusPlanService.deletePoint(campusId, id).subscribe(() => this.reload());
  }
}
