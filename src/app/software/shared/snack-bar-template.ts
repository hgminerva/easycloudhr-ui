import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

export class SnackBarTemplate {
    // Snack Bar Position
    public snackBarHorizontalPosition: MatSnackBarHorizontalPosition = 'right';
    public snackBarVerticalPosition: MatSnackBarVerticalPosition = 'top';

    // Snackbar Success
    public snackBarSuccess(snackBar: MatSnackBar, message: string): void {
        snackBar.open(message, '', {
            duration: 2000,
            horizontalPosition: this.snackBarHorizontalPosition,
            verticalPosition: this.snackBarVerticalPosition,
            panelClass: ["green-snackbar"]
        });
    }

    // Snackbar Error
    public snackBarError(snackBar: MatSnackBar, message: string): void {
        snackBar.open(message, '', {
            duration: 2000,
            horizontalPosition: this.snackBarHorizontalPosition,
            verticalPosition: this.snackBarVerticalPosition,
            panelClass: ["orange-snackbar"]
        });
    }
}