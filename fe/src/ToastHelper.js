import toastr from 'toastr'
import 'toastr/build/toastr.min.css';

export class ToastHelper {
    static {
        toastr.options = {
            hideDuration: 300,
            timeOut: 6000
        }
    }

    static success(msg) {
        toastr.success(msg).show();
    }

    static error(msg) {
        console.log("error", msg);
        toastr.error(msg).show();
    }
}