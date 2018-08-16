import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {map} from 'rxjs/operators';
import {UserDTO} from "../model/user-dto";

@Injectable()
export class UserService {
  private authUserLocalStorageKey = 'authenticated-user';
  public minUsernameLength = 6;
  public minPasswordLength = 6;
  public authenticatedUser: UserDTO = null;

  constructor(public http: Http) {
    let authenticatedUserJson = localStorage.getItem(this.authUserLocalStorageKey);
    if (authenticatedUserJson != null) {
      this.authenticatedUser = JSON.parse(authenticatedUserJson);
    }
  }

  public signUp(username: string, password: string) {
    return this.http.post('api/users', {username: username, password: password}).pipe(map((response: Response) => {
      return response.json();
    }));
  }

  public signIn(username: string, password: string) {
    let observable = this.http.post('api/sessions', {
      username: username,
      password: password
    }).pipe(map((response: Response) => {
      return response.json();
    }));

    observable.subscribe((response: any) => {
      this.saveAuthorizedUserToLocalStorage(response);
    });

    return observable;
  }

  public signOut() {
    this.removeAuthorizedUserFromLocalStorage();
    return this.http.delete('api/sessions').pipe(map((response: Response) => {
      return response;
    }));
  }

  public saveAuthorizedUserToLocalStorage(userDTO: UserDTO) {
    this.authenticatedUser = userDTO;
    localStorage.setItem(this.authUserLocalStorageKey, JSON.stringify(this.authenticatedUser));
  }

  public removeAuthorizedUserFromLocalStorage() {
    this.authenticatedUser = null;
    localStorage.setItem(this.authUserLocalStorageKey, null);
  }
}
