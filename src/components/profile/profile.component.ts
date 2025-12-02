import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { User, BookingHistoryItem, WorkoutLog } from '../../models';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { FormsModule } from '@angular/forms';
import { EditStatsModalComponent } from '../edit-stats-modal/edit-stats-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditProfileModalComponent, ChangePasswordModalComponent, FormsModule, EditStatsModalComponent],
})
export class ProfileComponent implements OnInit {
  private dataService = inject(DataService);
  user = signal<User | null>(null);
  bookingHistory = signal<BookingHistoryItem[]>([]);
  workoutHistory = signal<WorkoutLog[]>([]);
  historyPeriod = signal<'week' | 'month'>('week');
  loading = signal(true);
  isEditModalOpen = signal(false);
  isChangePasswordModalOpen = signal(false);
  isStatsModalOpen = signal(false);

  // State for inline editing the goal
  isGoalEditing = signal(false);
  editingGoal = signal('');

  async ngOnInit() {
    this.loading.set(true);
    const [profileData, classHistoryData, workoutHistoryData] = await Promise.all([
      this.dataService.getProfile(),
      this.dataService.getBookingHistory(),
      this.dataService.getWorkoutHistory()
    ]);
    this.user.set(profileData);
    this.bookingHistory.set(classHistoryData);
    this.workoutHistory.set(workoutHistoryData);
    this.loading.set(false);
  }

  bmi = computed(() => {
    const currentUser = this.user();
    if (!currentUser) return 0;
    
    const heightInMeters = currentUser.height / 100;
    if (heightInMeters > 0) {
      const bmiValue = currentUser.weight / (heightInMeters * heightInMeters);
      return Math.round(bmiValue * 10) / 10; // Round to one decimal place
    }
    return 0;
  });

  filteredWorkoutHistory = computed(() => {
    const now = new Date();
    const history = this.workoutHistory();

    if (this.historyPeriod() === 'week') {
      const oneWeekAgo = new Date(new Date().setDate(now.getDate() - 7));
      return history.filter(log => new Date(log.completed_at) >= oneWeekAgo);
    } else { // 'month'
      const today = new Date();
      return history.filter(log => {
        const logDate = new Date(log.completed_at);
        return logDate.getMonth() === today.getMonth() && logDate.getFullYear() === today.getFullYear();
      });
    }
  });

  setHistoryPeriod(period: 'week' | 'month') {
    this.historyPeriod.set(period);
  }

  formatDate(isoString: string) {
    return new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  }

  // --- Edit Profile Modal ---
  openEditModal() {
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
  }

  async handleProfileUpdate(updatedData: Partial<User>) {
    const updatedUser = await this.dataService.updateUserProfile(updatedData);
    if (updatedUser) {
      this.user.set(updatedUser);
    }
    this.closeEditModal();
  }

  // --- Change Password Modal ---
  openChangePasswordModal() {
    this.isChangePasswordModalOpen.set(true);
  }

  closeChangePasswordModal() {
    this.isChangePasswordModalOpen.set(false);
  }
  
  handleChangePassword() {
    // La lógica de éxito ya se maneja dentro del modal,
    // así que aquí solo cerramos.
    this.closeChangePasswordModal();
  }

  // --- Edit Stats Modal ---
  openStatsModal() {
    this.isStatsModalOpen.set(true);
  }

  closeStatsModal() {
    this.isStatsModalOpen.set(false);
  }

  async handleStatsUpdate(updatedData: Partial<User>) {
    const updatedUser = await this.dataService.updateUserProfile(updatedData);
    if (updatedUser) {
      this.user.set(updatedUser);
    }
    this.closeStatsModal();
  }

  // --- Goal Inline Editing ---
  startGoalEdit() {
    if (this.user()) {
      this.editingGoal.set(this.user()!.goal);
      this.isGoalEditing.set(true);
    }
  }

  cancelGoalEdit() {
    this.isGoalEditing.set(false);
  }

  async saveGoal() {
    const currentUser = this.user();
    if (currentUser && this.editingGoal() !== currentUser.goal) {
      const updatedUser = await this.dataService.updateUserProfile({ goal: this.editingGoal() });
      if (updatedUser) {
        this.user.set(updatedUser);
      }
    }
    this.isGoalEditing.set(false);
  }
}