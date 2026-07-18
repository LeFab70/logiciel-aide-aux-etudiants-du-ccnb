import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { CampusService } from '../../core/campus.service';
import { FaqService } from '../../core/faq.service';
import { Campus, Faq } from '../../core/models';
import { CrudColumn, CrudTable } from '../../shared/crud-table/crud-table';
import { CrudField } from '../../shared/crud-table/crud-field';

@Component({
  selector: 'app-faq-admin',
  imports: [CrudTable, FormsModule],
  templateUrl: './faq-admin.html',
  styleUrl: '../admin-page.scss',
})
export class FaqAdmin {
  private readonly faqService = inject(FaqService);
  private readonly campusService = inject(CampusService);
  private readonly authService = inject(AuthService);

  readonly faqs = signal<Faq[]>([]);
  readonly fields = signal<CrudField[]>([]);
  readonly campuses = signal<Campus[]>([]);
  readonly selectedCampusId = signal<number | null>(null);

  readonly columns: CrudColumn[] = [
    { key: 'question', label: 'Question' },
    { key: 'category', label: 'Catégorie' },
    { key: 'displayOrder', label: 'Ordre' },
  ];

  constructor() {
    this.selectedCampusId.set(this.authService.currentUser()?.campus.id ?? null);
    this.campusService.list().subscribe((campuses) => {
      this.campuses.set(campuses);
      this.fields.set([
        { key: 'question', label: 'Question', type: 'textarea', required: true },
        { key: 'answer', label: 'Réponse', type: 'textarea', required: true },
        { key: 'category', label: 'Catégorie', type: 'text' },
        { key: 'displayOrder', label: 'Ordre', type: 'number', required: true },
        {
          key: 'campusId',
          label: 'Campus',
          type: 'select',
          options: [
            { value: null, label: 'Tous les campus' },
            ...campuses.map((c) => ({ value: c.id, label: c.name })),
          ],
        },
      ]);
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
    this.faqService.list(campusId).subscribe((faqs) => this.faqs.set(faqs));
  }

  onCreate(value: Record<string, unknown>): void {
    this.faqService.create(value as unknown as Omit<Faq, 'id'>).subscribe(() => this.reload());
  }

  onUpdate(event: { id: number; value: Record<string, unknown> }): void {
    this.faqService
      .update(event.id, event.value as unknown as Omit<Faq, 'id'>)
      .subscribe(() => this.reload());
  }

  onDelete(id: number): void {
    this.faqService.delete(id).subscribe(() => this.reload());
  }
}
