export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  day: string; // 'Lunes', 'Martes', etc.
  user_id: string;
}

export interface GymClass {
  id: number;
  name:string;
  instructor: string;
  time: string;
  duration: number; // in minutes
  spots_available: number;
}

// Represents a user's profile data stored in the 'profiles' table.
export interface User {
  id: string; // Corresponds to Supabase auth user ID
  name: string;
  email: string;
  avatarUrl: string;
  phone?: string; // Nuevo campo para el teléfono
  height: number; // in cm
  weight: number; // in kg
  goal: string;
  memberSince: string;
  bodyFatPercentage?: number;
}

export interface Booking {
  id: number;
  class_id: number;
  user_id: string;
  status: 'Asistió' | 'Cancelado' | 'Reservado';
  classes?: { name: string }; // For joined data
}

// Keep old model for compatibility in profile component, but it's now derived from Booking
export interface BookingHistoryItem {
  id: number;
  className: string;
  date: string;
  status: 'Asistió' | 'Cancelado' | 'Reservado';
}

export interface WorkoutLog {
  id: number;
  exercise_name: string;
  sets: number;
  reps: string;
  weight?: number;
  completed_at: string; // ISO string date
}