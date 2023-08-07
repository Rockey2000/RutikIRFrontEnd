
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const cascadeValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  const client = formGroup.get('client');
  const documentType = formGroup.get('documentType');
  
  if (client.value && documentType.value) {
    return null;
  } else {
    return { cascadeRequired: true };
  }
};
