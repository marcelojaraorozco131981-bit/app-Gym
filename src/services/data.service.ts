

import { Injectable, signal, WritableSignal } from '@angular/core';
import { GymClass, Exercise, User, Booking, BookingHistoryItem, WorkoutLog } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private user: WritableSignal<User> = signal({
    id: 'user-123',
    name: 'Alex Romero',
    email: 'alex.romero@example.com',
    avatarUrl: 'https://picsum.photos/seed/alex/200',
    phone: '555-123-4567',
    height: 180,
    weight: 78,
    goal: 'Aumento de Masa Muscular',
    memberSince: 'Enero 2023',
    bodyFatPercentage: 15,
  });

  private classes: WritableSignal<GymClass[]> = signal([
    { id: 1, name: 'Yoga Vinyasa', instructor: 'Elena Garcia', time: '08:00 AM', duration: 60, spots_available: 5 },
    { id: 2, name: 'HIIT Intense', instructor: 'Carlos Ruiz', time: '09:30 AM', duration: 45, spots_available: 10 },
    { id: 3, name: 'Boxeo Fitness', instructor: 'Sofia Marquez', time: '06:00 PM', duration: 75, spots_available: 3 },
    { id: 4, name: 'Spinning Pro', instructor: 'David Chen', time: '07:30 PM', duration: 50, spots_available: 0 },
  ]);
  
  private routine: WritableSignal<Exercise[]> = signal([
      { id: 1, name: 'Press de Banca', sets: 4, reps: '8-10', weight: 80, day: 'Lunes', user_id: 'user-123' },
      { id: 2, name: 'Dominadas', sets: 4, reps: 'Al fallo', day: 'Lunes', user_id: 'user-123' },
      { id: 3, name: 'Sentadillas', sets: 5, reps: '5', weight: 120, day: 'Miércoles', user_id: 'user-123' },
      { id: 4, name: 'Peso Muerto', sets: 3, reps: '5', weight: 140, day: 'Viernes', user_id: 'user-123' },
  ]);

  private bookings: WritableSignal<Booking[]> = signal([
    { id: 1, class_id: 3, user_id: 'user-123', status: 'Reservado' }
  ]);
  
  private workoutLogs: WritableSignal<WorkoutLog[]> = signal([
    { id: 1, exercise_name: 'Press de Banca', sets: 4, reps: '8', weight: 80, completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 2, exercise_name: 'Sentadillas', sets: 5, reps: '5', weight: 120, completed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  ]);


  // Profile Methods
  async getProfile(): Promise<User | null> {
    return Promise.resolve(this.user());
  }

  async updateUserProfile(updatedData: Partial<User>): Promise<User | null> {
    this.user.update(current => ({...current, ...updatedData }));
    return Promise.resolve(this.user());
  }

  // Class Methods
  async getClasses(): Promise<GymClass[]> {
    return Promise.resolve(this.classes());
  }

  // Routine Methods
  async getRoutine(): Promise<Exercise[]> {
    return Promise.resolve(this.routine());
  }

  async saveExercise(exercise: Omit<Exercise, 'id' | 'user_id'> & { id?: number }): Promise<Exercise | null> {
    const user_id = this.user().id;
    if (exercise.id) { // Update existing
      let updatedExercise: Exercise | null = null;
      this.routine.update(r => r.map(ex => {
        if (ex.id === exercise.id) {
          updatedExercise = { ...ex, ...exercise, user_id };
          return updatedExercise;
        }
        return ex;
      }));
      return Promise.resolve(updatedExercise);
    } else { // Add new
      const newExercise: Exercise = {
        ...exercise,
        id: Date.now(), // simple unique id
        user_id,
      };
      this.routine.update(r => [...r, newExercise]);
      return Promise.resolve(newExercise);
    }
  }

  async deleteExercise(exerciseId: number): Promise<{ success: boolean }> {
    this.routine.update(r => r.filter(ex => ex.id !== exerciseId));
    return Promise.resolve({ success: true });
  }

  // Booking Methods
  async getUserBookings(): Promise<Booking[]> {
    return Promise.resolve(this.bookings());
  }

  async addBooking(classId: number): Promise<Booking | null> {
    const newBooking: Booking = {
      id: Date.now(),
      class_id: classId,
      user_id: this.user().id,
      status: 'Reservado'
    };
    this.bookings.update(b => [...b, newBooking]);
    return Promise.resolve(newBooking);
  }

  async removeBooking(classId: number): Promise<{ success: boolean }> {
    this.bookings.update(b => b.filter(booking => booking.class_id !== classId));
    return Promise.resolve({ success: true });
  }

  async getBookingHistory(): Promise<BookingHistoryItem[]> {
    const history: BookingHistoryItem[] = [
        { id: 1, className: 'Boxeo Fitness', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(), status: 'Asistió' },
        { id: 2, className: 'Yoga Vinyasa', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString(), status: 'Asistió' },
    ];
    return Promise.resolve(history);
  }

  // Workout Log Methods
  async getWorkoutHistory(): Promise<WorkoutLog[]> {
    return Promise.resolve(this.workoutLogs());
  }

  async logWorkout(exercise: Exercise): Promise<WorkoutLog | null> {
    const newLog: WorkoutLog = {
      id: Date.now(),
      exercise_name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      completed_at: new Date().toISOString()
    };
    this.workoutLogs.update(logs => [newLog, ...logs]);
    return Promise.resolve(newLog);
  }
}