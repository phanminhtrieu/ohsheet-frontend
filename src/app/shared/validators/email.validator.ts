import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailPatternValidator(): ValidatorFn {
  const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // required xử lý riêng
    return pattern.test(value) ? null : { invalidEmail: true };
  };
}