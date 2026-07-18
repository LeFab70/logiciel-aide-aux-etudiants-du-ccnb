import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FaqService } from '../../core/faq.service';
import { Faq } from '../../core/models';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.html',
  styleUrl: './faq-list.scss',
})
export class FaqList {
  private readonly faqService = inject(FaqService);
  private readonly authService = inject(AuthService);

  readonly faqs = signal<Faq[]>([]);

  constructor() {
    const campusId = this.authService.currentUser()?.campus.id;
    this.faqService.list(campusId).subscribe((faqs) => this.faqs.set(faqs));
  }
}
