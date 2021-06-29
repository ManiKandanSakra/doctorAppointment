import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorComponent } from './pages/doctor/doctor.component';

const routes: Routes = [
  {path:'',component:DoctorComponent},
  {path:'slot',component:DoctorComponent},
  {path:'slot-list',component:DoctorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
