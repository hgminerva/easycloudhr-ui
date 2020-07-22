import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpHeaders } from '@angular/common/http';

export class AppSettings {
    // API URL
    public defaultAPIURLHost = "https://localhost:44369";

    // URL Encoded Options
    public URLEncodedOptions: any = {
        headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    };

    // Default Options
    public defaultOptions: any = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        })
    };

    // Snack Bar Position
    public snackBarHorizontalPosition: MatSnackBarHorizontalPosition = 'right';
    public snackBarVerticalPosition: MatSnackBarVerticalPosition = 'top';

    // Snackbar Success
    public snackBarSuccess(snackBar: MatSnackBar, message: string): void {
        snackBar.open(message, '', {
            duration: 3000,
            horizontalPosition: this.snackBarHorizontalPosition,
            verticalPosition: this.snackBarVerticalPosition,
            panelClass: ["green-snackbar"]
        });
    }

    // Snackbar Error
    public snackBarError(snackBar: MatSnackBar, message: string): void {
        snackBar.open(message, '', {
            duration: 3000,
            horizontalPosition: this.snackBarHorizontalPosition,
            verticalPosition: this.snackBarVerticalPosition,
            panelClass: ["orange-snackbar"]
        });
    }
}