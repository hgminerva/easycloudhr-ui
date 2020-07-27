import { AbstractControl } from '@angular/forms';

export function PasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const Password = control.get('Password');
    const ConfirmPassword = control.get('ConfirmPassword');
    if (Password.pristine || ConfirmPassword.pristine) {
        return null;
    }
    return Password.value !== ConfirmPassword.value ? { 'misMatch': true } : null;
}