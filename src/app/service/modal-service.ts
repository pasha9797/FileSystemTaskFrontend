import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {UserService} from "./user-service";

declare var $: any;

@Injectable()
export class ModalService {
  public modalMessage = '...';
  public modalHeader = '...';

  constructor(private router: Router, private userService: UserService) {

  }

  showModal(message: string, header: string) {
    this.modalMessage = message;
    this.modalHeader = header;
    $('#myModal').modal('show');
  }

  defaultRequestErrorHandler(modalHeader: string, error) {
    console.log(error);
    if (error.status == 0 || error.status == 504)
      this.showModal('Lost connection to the server', modalHeader);
    else if(error.status==401){
      this.showModal('You are unauthorized. Please sign in', modalHeader);
      this.userService.removeAuthorizedUserFromLocalStorage();
    }
    else if(error.status==403){
      this.showModal('You do not have enough permissions to perform this action!', modalHeader);
    }
    else if (error.status > 0)
      this.showModal(error.error, modalHeader);
    else
      this.showModal('Unknown error occurred', modalHeader);
  }
}
