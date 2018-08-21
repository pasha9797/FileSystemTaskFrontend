import {Injectable} from '@angular/core';
import {UserDTO} from "../model/user-dto";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class UserService {
  private authUserLocalStorageKey = 'authenticated-user';
  public static TOKEN_HEADER = 'ACCESS-TOKEN';
  public static TOKEN_STORAGE_KEY = 'auth_token';
  public minUsernameLength = 6;
  public minPasswordLength = 6;

  public authenticatedUser: UserDTO = null;

  constructor(public http: HttpClient) {
    let authenticatedUserJson = localStorage.getItem(this.authUserLocalStorageKey);
    if (authenticatedUserJson != null) {
      this.authenticatedUser = JSON.parse(authenticatedUserJson);
    }
  }

  public signUp(username: string, password: string) {
    return this.http.post('api/users', {username: username, password: password});
  }

  public signIn(username: string, password: string) {
    let observable = this.http.post('api/sessions', {
      username: username,
      password: password
    },{observe: 'response'});

    observable.subscribe((response: any) => {
      let token = response.headers.get(UserService.TOKEN_HEADER);
      this.saveAuthorizedUserToLocalStorage(response.body,token);
    });

    return observable;
  }

  public signOut() {
    this.removeAuthorizedUserFromLocalStorage();
  }

  public saveAuthorizedUserToLocalStorage(userDTO: UserDTO, token: string) {
    this.authenticatedUser = userDTO;
    localStorage.setItem(this.authUserLocalStorageKey, JSON.stringify(this.authenticatedUser));
    localStorage.setItem(UserService.TOKEN_STORAGE_KEY, token);
  }

  public removeAuthorizedUserFromLocalStorage() {
    this.authenticatedUser = null;
    localStorage.setItem(this.authUserLocalStorageKey, null);
    localStorage.removeItem(UserService.TOKEN_STORAGE_KEY);
  }
}
