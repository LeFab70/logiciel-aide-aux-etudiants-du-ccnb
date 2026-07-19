import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FaqService } from '../../core/faq.service';
import { Faq } from '../../core/models';
import { AppIcon } from '../../shared/icon/icon';

@Component({
  selector: 'app-faq-list',
  imports: [AppIcon],
  templateUrl: './faq-list.html',
  styleUrl: './faq-list.scss',
})
export class FaqList {
  private readonly faqService = inject(FaqService);
  private readonly authService = inject(AuthService);

  readonly faqs = signal<Faq[]>([]);
  readonly expandedId = signal<number | null>(null);

  constructor() {
    const campusId = this.authService.currentUser()?.campus.id;
    this.faqService.list(campusId).subscribe((faqs) => this.faqs.set(faqs));
  }

  toggle(id: number): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }
}
