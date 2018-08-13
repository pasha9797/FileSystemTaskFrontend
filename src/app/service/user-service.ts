import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {map} from 'rxjs/operators';
import {UserDTO} from "../model/user-dto";

@Injectable()
export class UserService {
  public minUsernameLength = 6;
  public minPasswordLength = 6;

  constructor(public http: Http) {
  }

  public signUp(username: string, password: string) {
    return this.http.post('api/users', {username: username, password: password}).pipe(map((response: Response) => {
      return response.json();
    }));
  }

  public signIn(username: string, password: string) {
    return this.http.post('api/users/sessions', {username: username, password: password}).pipe(map((response: Response) => {
      return response;
    }));
  }
}
