import {Component, OnInit} from '@angular/core';
import {UserService} from '../service/user-service';
import {ModalService} from '../service/modal-service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.css']
})
export class SignInPageComponent implements OnInit {
  username: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(private userService: UserService, public modalService: ModalService, private router: Router) {
  }

  ngOnInit() {
  }

  signIn() {
    this.loading = true;
    this.userService.signIn(this.username, this.password).subscribe(
      (content: any) => {
        this.modalService.showModal('You have successfully signed in', 'Signed in successfully');
        console.log('Signed in successfully');
        this.loading = false;
        this.router.navigate(['/browser']);
      },
      (error) => {
        this.loading = false;
        this.modalService.defaultRequestErrorHandler('Unable to sign in', error);
      });
  }

}
