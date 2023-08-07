export interface analyst{
    analystName:string;
    pocName:string;
    pocEmailId:string;
    analystId: string;
}

// import { FormControl, ValidationErrors } from '@angular/forms';

// // Custom validator function for POC Name chips
// export function pocNameValidator(control: FormControl): ValidationErrors | null {
//   const values: string[] = control.value || [];
//   const pattern: RegExp = /^[a-zA-Z]+$/;

//   const invalidValues: string[] = values.filter(value => !pattern.test(value));

//   return invalidValues.length > 0 ? { invalidChips: invalidValues } : null;
// }

// export function pocEmailValidator(control: FormControl): ValidationErrors | null {
//     const values: string[] = control.value || [];
//     const pattern: RegExp = /^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z]+[.]{1}[A-Za-z]{2,4}$/;
  
//     const invalidValues: string[] = values.filter(value => !pattern.test(value));
  
//     return invalidValues.length > 0 ? { invalidChips: invalidValues } : null;
//   }
  