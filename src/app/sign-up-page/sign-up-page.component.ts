import {Component, OnInit} from '@angular/core';
import {UserDTO} from '../model/user-dto';
import {UserService} from '../service/user-service';
import {ModalService} from '../service/modal-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})
export class SignUpPageComponent implements OnInit {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;

  constructor(private userService: UserService, public modalService: ModalService, private router: Router) {
  }

  ngOnInit() {
  }

  signUp() {
    if (this.username.length < this.userService.minUsernameLength) {
      this.modalService.showModal('Username must be at least ' + this.userService.minUsernameLength + ' characters', 'Wrong username');
      return;
    }
    if (this.password.length < this.userService.minPasswordLength) {
      this.modalService.showModal('Password must be at least ' + this.userService.minPasswordLength + ' characters', 'Wrong password');
      return;
    }
    if (this.password != this.confirmPassword) {
      this.modalService.showModal('Passwords entered by you do not match', 'Passwords mismatch');
      return;
    }

    this.loading = true;
    this.userService.signUp(this.username, this.password).subscribe(
      (content: any) => {
        this.modalService.showModal('Signed up successfully, now you can sign in.', 'Signed up successfully');
        console.log('Signed up successfully');
        this.loading = false;
        this.router.navigate(['/sign-in']);
      },
      (error) => {
        this.loading = false;
        this.modalService.defaultRequestErrorHandler('Unable to sign up', error);
      });
  }

}
