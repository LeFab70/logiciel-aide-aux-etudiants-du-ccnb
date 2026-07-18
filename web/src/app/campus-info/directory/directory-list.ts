import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { DirectoryService } from '../../core/directory.service';
import { DirectoryContact } from '../../core/models';

@Component({
  selector: 'app-directory-list',
  templateUrl: './directory-list.html',
  styleUrl: './directory-list.scss',
})
export class DirectoryList {
  private readonly directoryService = inject(DirectoryService);
  private readonly authService = inject(AuthService);

  readonly contacts = signal<DirectoryContact[]>([]);

  constructor() {
    const campusId = this.authService.currentUser()?.campus.id;
    if (campusId) {
      this.directoryService.list(campusId).subscribe((contacts) => this.contacts.set(contacts));
    }
  }
}
