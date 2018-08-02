import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {BrowserPageComponent} from "./browser-page/browser-page.component";
import {SignInPageComponent} from "./sign-in-page/sign-in-page.component";
import {SignUpPageComponent} from "./sign-up-page/sign-up-page.component";

const routes: Routes = [
  {path: 'browser', component: BrowserPageComponent},
  {path: 'sign-in', component: SignInPageComponent},
  {path: 'sign-up', component: SignUpPageComponent},
  {path: '', redirectTo: '/browser', pathMatch: 'full'}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
