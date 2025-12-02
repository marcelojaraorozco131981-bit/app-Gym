






import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutinePlannerComponent } from './components/routine-planner/routine-planner.component';
import { ClassScheduleComponent } from './components/class-schedule/class-schedule.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { EditProfileModalComponent } from './components/edit-profile-modal/edit-profile-modal.component';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { EditStatsModalComponent } from './components/edit-stats-modal/edit-stats-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RoutinePlannerComponent,
    ClassScheduleComponent,
    ProfileComponent,
    LoginComponent,
    EditProfileModalComponent,
    ChangePasswordModalComponent,
    EditStatsModalComponent,
  ],
})
export class AppComponent {
  mainView = signal<'routine' | 'classes' | 'profile'>('routine');
  isLoggedIn = signal<boolean>(false); // Inicia como desconectado

  navigateTo(view: 'routine' | 'classes' | 'profile') {
    this.mainView.set(view);
  }

  onLoginSuccess(): void {
    this.isLoggedIn.set(true);
  }

  signOut(): void {
    this.isLoggedIn.set(false);
    // Restablece la vista predeterminada al cerrar sesión
    this.mainView.set('routine');
  }
}