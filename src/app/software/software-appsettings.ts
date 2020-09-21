import { HttpHeaders } from '@angular/common/http';

export class AppSettings {
    // API URL
    public defaultAPIURLHost = "https://easycloudhrapi.azurewebsites.net";
    // public defaultAPIURLHost = "https://localhost:44369";

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
}
