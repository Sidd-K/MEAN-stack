import { NgModule} from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: PostListComponent },

  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},

  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignUpComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {}
