 
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiResponse } from '../models/response';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router,    
    ) { }
    
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<ApiResponse<any>>> {
        
        return next.handle(request).pipe(catchError(err => {
            console.log("inerceped", err)

            if (err.status === 401) {
                // auto logout if 401 response returned from api
                console.log("heyys")
                this.authService.logout();
                this.router.navigate(["/"]);
            } else if(err.status === 404) {
                // return throwError(err.statusText);
            }
            
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}