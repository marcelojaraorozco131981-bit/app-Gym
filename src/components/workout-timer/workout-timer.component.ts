
import { ChangeDetectionStrategy, Component, computed, input, OnDestroy, output, signal } from '@angular/core';
import { Exercise } from '../../models';

@Component({
  selector: 'app-workout-timer',
  templateUrl: './workout-timer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutTimerComponent implements OnDestroy {
  exercise = input.required<Exercise>();
  workoutFinished = output<void>();

  elapsedSeconds = signal(0);
  isRunning = signal(false);
  private intervalId: any = null;

  formattedTime = computed(() => {
    const minutes = Math.floor(this.elapsedSeconds() / 60);
    const seconds = this.elapsedSeconds() % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  });

  startTimer() {
    if (this.isRunning()) return;
    this.isRunning.set(true);
    this.intervalId = setInterval(() => {
      this.elapsedSeconds.update(s => s + 1);
    }, 1000);
  }

  pauseTimer() {
    if (!this.isRunning()) return;
    this.isRunning.set(false);
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  resetTimer() {
    this.pauseTimer();
    this.elapsedSeconds.set(0);
  }
  
  finishWorkout() {
    this.resetTimer();
    this.workoutFinished.emit();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
