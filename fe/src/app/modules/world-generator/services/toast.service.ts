import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {

  }

  success(message: string, title?: string) {
    this.toastr.success(message, title ?? 'Success');
  }

  warning(message: string, title?: string) {
    this.toastr.warning(message, title ?? 'Warning', { timeOut: 15000 });
  }

  error(message: string, title?: string) {
    this.toastr.error(message, title ?? 'Error', { disableTimeOut: true });
  }
}