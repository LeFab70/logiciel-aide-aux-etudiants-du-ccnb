import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudField } from './crud-field';
import { AppIcon } from '../icon/icon';

export interface CrudColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-crud-table',
  imports: [ReactiveFormsModule, AppIcon],
  templateUrl: './crud-table.html',
  styleUrl: './crud-table.scss',
})
export class CrudTable<T extends { id: number }> implements OnChanges {
  @Input({ required: true }) title = '';
  @Input({ required: true }) columns: CrudColumn[] = [];
  @Input({ required: true }) fields: CrudField[] = [];
  @Input({ required: true }) items: T[] = [];

  @Output() create = new EventEmitter<Record<string, unknown>>();
  @Output() update = new EventEmitter<{ id: number; value: Record<string, unknown> }>();
  @Output() delete = new EventEmitter<number>();

  showForm = false;
  editingId: number | null = null;
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    const controls: Record<string, unknown> = {};
    for (const field of this.fields) {
      controls[field.key] = [null, field.required ? [Validators.required] : []];
    }
    this.form = this.fb.group(controls);
  }

  openCreate(): void {
    this.editingId = null;
    this.form.reset();
    this.showForm = true;
  }

  openEdit(item: T): void {
    this.editingId = item.id;
    this.form.reset();
    this.form.patchValue(item as unknown as Record<string, unknown>);
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (this.editingId !== null) {
      this.update.emit({ id: this.editingId, value });
    } else {
      this.create.emit(value);
    }
    this.showForm = false;
    this.editingId = null;
  }

  remove(id: number): void {
    this.delete.emit(id);
  }

  displayValue(item: T, key: string): unknown {
    return (item as unknown as Record<string, unknown>)[key];
  }
}
