import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed } from '@angular/core';
import { DataService } from '../../services/data.service';
import { GymClass, Booking } from '../../models';

@Component({
  selector: 'app-class-schedule',
  templateUrl: './class-schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassScheduleComponent implements OnInit {
  private dataService = inject(DataService);
  
  classes = signal<GymClass[]>([]);
  userBookings = signal<Booking[]>([]);
  loading = signal(true);

  bookedClassIds = computed(() => new Set(this.userBookings().map(b => b.class_id)));

  displayClasses = computed(() => {
    const bookedIds = this.bookedClassIds();
    return this.classes().map(c => ({
      ...c,
      booked: bookedIds.has(c.id)
    }));
  });

  async ngOnInit() {
    this.loading.set(true);
    const [classesData, bookingsData] = await Promise.all([
      this.dataService.getClasses(),
      this.dataService.getUserBookings()
    ]);
    this.classes.set(classesData);
    this.userBookings.set(bookingsData);
    this.loading.set(false);
  }

  async toggleBooking(gymClass: (GymClass & { booked: boolean })) {
    if (gymClass.booked) {
      // Remove booking
      const success = await this.dataService.removeBooking(gymClass.id);
      if (success) {
        this.userBookings.update(bookings => bookings.filter(b => b.class_id !== gymClass.id));
        this.classes.update(classes => classes.map(c => c.id === gymClass.id ? {...c, spots_available: c.spots_available + 1} : c));
      }
    } else {
      // Add booking
      const newBooking = await this.dataService.addBooking(gymClass.id);
      if (newBooking) {
        this.userBookings.update(bookings => [...bookings, newBooking]);
        this.classes.update(classes => classes.map(c => c.id === gymClass.id ? {...c, spots_available: c.spots_available - 1} : c));
      }
    }
  }
}
