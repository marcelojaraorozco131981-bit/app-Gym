import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models';

@Component({
  selector: 'app-edit-stats-modal',
  templateUrl: './edit-stats-modal.component.html',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditStatsModalComponent implements OnInit {
  user = input.required<User>();
  close = output<void>();
  save = output<Partial<User>>();

  height = signal(0);
  weight = signal(0);
  bodyFatPercentage = signal(0);

  ngOnInit() {
    this.height.set(this.user().height);
    this.weight.set(this.user().weight);
    this.bodyFatPercentage.set(this.user().bodyFatPercentage || 0);
  }

  onSave() {
    const updatedData: Partial<User> = {
      height: this.height(),
      weight: this.weight(),
      bodyFatPercentage: this.bodyFatPercentage(),
    };
    this.save.emit(updatedData);
  }

  onClose() {
    this.close.emit();
  }
}
