import {Component} from '@angular/core';
import {ModalService} from "./service/modal-service";
import {UserService} from "./service/user-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(public modalService: ModalService, public userService: UserService, private router: Router) {

  }

  signOut() {
    this.userService.signOut();
    console.log('Signed out successfully');
    this.router.navigate(['/sign-in']);

    return false;
  }
}
