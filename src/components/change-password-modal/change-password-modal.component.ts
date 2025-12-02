import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordModalComponent {
  close = output<void>();
  save = output<void>(); // Emits on successful password change simulation

  currentPassword = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  loading = signal(false);

  onSave() {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.loading.set(true);

    // Basic validation
    if (!this.currentPassword() || !this.newPassword() || !this.confirmPassword()) {
      this.errorMessage.set('Todos los campos son obligatorios.');
      this.loading.set(false);
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('Las nuevas contraseñas no coinciden.');
      this.loading.set(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      this.loading.set(false);
      // In a real app, you'd verify the currentPassword here.
      this.successMessage.set('¡Contraseña cambiada con éxito!');
      
      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        this.save.emit();
      }, 1500);

    }, 1000);
  }

  onClose() {
    this.close.emit();
  }
}
