import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Exercise } from '../../models';
import { WorkoutTimerComponent } from '../workout-timer/workout-timer.component';

@Component({
  selector: 'app-routine-planner',
  templateUrl: './routine-planner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WorkoutTimerComponent, FormsModule],
})
export class RoutinePlannerComponent implements OnInit {
  private dataService = inject(DataService);
  
  routine = signal<Exercise[]>([]);
  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  selectedDay = signal<string>(this.daysOfWeek[0]);
  isModalOpen = signal(false);
  loading = signal(true);
  
  exerciseToEdit = signal<Exercise | null>(null);
  
  activeWorkout = signal<Exercise | null>(null);

  exercisesForSelectedDay = computed(() => {
    return this.routine().filter(ex => ex.day === this.selectedDay());
  });

  async ngOnInit() {
    this.loading.set(true);
    const routineData = await this.dataService.getRoutine();
    this.routine.set(routineData);
    this.loading.set(false);
  }

  selectDay(day: string): void {
    this.selectedDay.set(day);
  }

  openAddModal(): void {
    this.exerciseToEdit.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(exercise: Exercise): void {
    this.exerciseToEdit.set({ ...exercise });
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.exerciseToEdit.set(null);
  }

  async saveExercise(formValue: { name: string; sets: string; reps: string; weight: string }): Promise<void> {
    const day = this.selectedDay();
    if (!day) return;

    const exercise: Omit<Exercise, 'id' | 'user_id'> & { id?: number } = {
      id: this.exerciseToEdit()?.id,
      name: formValue.name,
      sets: parseInt(formValue.sets, 10),
      reps: formValue.reps,
      weight: formValue.weight ? parseInt(formValue.weight, 10) : undefined,
      day: day
    };
    
    const savedExercise = await this.dataService.saveExercise(exercise);
    
    if (savedExercise) {
      this.routine.update(r => {
        if (this.exerciseToEdit()) {
          return r.map(ex => ex.id === savedExercise.id ? savedExercise : ex);
        } else {
          return [...r, savedExercise];
        }
      });
    }

    this.closeModal();
  }
  
  async deleteExercise(exerciseId: number): Promise<void> {
    const { success } = await this.dataService.deleteExercise(exerciseId);
    if (success) {
      this.routine.update(r => r.filter(ex => ex.id !== exerciseId));
    }
  }

  startWorkout(exercise: Exercise): void {
    this.activeWorkout.set(exercise);
  }
  
  finishWorkout(): void {
    const finishedExercise = this.activeWorkout();
    if (finishedExercise) {
      this.dataService.logWorkout(finishedExercise);
    }
    this.activeWorkout.set(null);
  }
}
