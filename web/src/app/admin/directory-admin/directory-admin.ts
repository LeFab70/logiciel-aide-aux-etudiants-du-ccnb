import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { CampusService } from '../../core/campus.service';
import { DirectoryService } from '../../core/directory.service';
import { Campus, DirectoryContact } from '../../core/models';
import { CrudColumn, CrudTable } from '../../shared/crud-table/crud-table';
import { CrudField } from '../../shared/crud-table/crud-field';

@Component({
  selector: 'app-directory-admin',
  imports: [CrudTable, FormsModule],
  templateUrl: './directory-admin.html',
  styleUrl: '../admin-page.scss',
})
export class DirectoryAdmin {
  private readonly directoryService = inject(DirectoryService);
  private readonly campusService = inject(CampusService);
  private readonly authService = inject(AuthService);

  readonly contacts = signal<DirectoryContact[]>([]);
  readonly fields = signal<CrudField[]>([]);
  readonly campuses = signal<Campus[]>([]);
  readonly selectedCampusId = signal<number | null>(null);

  readonly columns: CrudColumn[] = [
    { key: 'name', label: 'Nom' },
    { key: 'role', label: 'Rôle' },
    { key: 'email', label: 'Email' },
  ];

  constructor() {
    this.selectedCampusId.set(this.authService.currentUser()?.campus.id ?? null);
    this.campusService.list().subscribe((campuses) => {
      this.campuses.set(campuses);
      this.fields.set([
        { key: 'name', label: 'Nom', type: 'text', required: true },
        { key: 'role', label: 'Rôle', type: 'text' },
        { key: 'department', label: 'Département', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'phone', label: 'Téléphone', type: 'text' },
        { key: 'officeLocation', label: 'Local', type: 'text' },
        {
          key: 'campusId',
          label: 'Campus',
          type: 'select',
          required: true,
          options: campuses.map((c) => ({ value: c.id, label: c.name })),
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
    this.directoryService.list(campusId).subscribe((contacts) => this.contacts.set(contacts));
  }

  onCreate(value: Record<string, unknown>): void {
    this.directoryService
      .create(value as unknown as Omit<DirectoryContact, 'id'>)
      .subscribe(() => this.reload());
  }

  onUpdate(event: { id: number; value: Record<string, unknown> }): void {
    this.directoryService
      .update(event.id, event.value as unknown as Omit<DirectoryContact, 'id'>)
      .subscribe(() => this.reload());
  }

  onDelete(id: number): void {
    this.directoryService.delete(id).subscribe(() => this.reload());
  }
}
