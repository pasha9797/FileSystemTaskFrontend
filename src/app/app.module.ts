import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FileSystemService} from "./service/file-system.service";
import {BrowserPageComponent} from './browser-page/browser-page.component';
import {SignUpPageComponent} from './sign-up-page/sign-up-page.component';
import {SignInPageComponent} from './sign-in-page/sign-in-page.component';
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from "./service/user-service";
import {ModalService} from "./service/modal-service";
import {JwtModule} from "@auth0/angular-jwt";

export function jwtTokenGetter() {
  return localStorage.getItem(UserService.TOKEN_STORAGE_KEY);
}

@NgModule({
  declarations: [
    AppComponent,
    BrowserPageComponent,
    SignUpPageComponent,
    SignInPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        headerName: UserService.TOKEN_HEADER,
        throwNoTokenError: false,
        tokenGetter: jwtTokenGetter,
        whitelistedDomains:["/api"]
      }
    }),
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [FileSystemService, UserService, ModalService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
