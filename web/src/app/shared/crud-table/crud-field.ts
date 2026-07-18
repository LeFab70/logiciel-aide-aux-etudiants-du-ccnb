export interface CrudSelectOption {
  value: string | number | null;
  label: string;
}

export interface CrudField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  required?: boolean;
  options?: CrudSelectOption[];
}
