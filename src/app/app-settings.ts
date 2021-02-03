import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpHeaders } from '@angular/common/http';

export class AppSetting {
    // API URL Gateway
    public defaultAPIURLHost = "https://easycloudhrapi.azurewebsites.net";

    // API Hiro Japan 
    // public defaultAPIURLHost = "http://hris-api.hiro-test.net";
 
    // public defaultAPIURLHost = "https://localhost:44369";
    // public defaultAPIURLHost = "http://192.169.1.9:8082";

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

    // Upload File Options
    public uploadFileOptions: any = {
        headers: new HttpHeaders({
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
