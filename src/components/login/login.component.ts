import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class LoginComponent {
  loginSuccess = output<void>();

  mode = signal<'login' | 'register' | 'forgotPassword'>('login');

  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  setMode(newMode: 'login' | 'register' | 'forgotPassword') {
    this.mode.set(newMode);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    // Limpiar campos para no arrastrar datos entre formularios
    this.name.set('');
    this.email.set('');
    this.password.set('');
    this.confirmPassword.set('');
  }

  handleLogin() {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Lógica de inicio de sesión simulada
    setTimeout(() => {
      if (this.email() && this.password()) {
        this.loginSuccess.emit();
      } else {
        this.errorMessage.set('Por favor, introduce correo y contraseña.');
      }
      this.loading.set(false);
    }, 500);
  }

  handleRegister() {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Lógica de registro simulada
    setTimeout(() => {
      if (!this.name() || !this.email() || !this.password()) {
        this.errorMessage.set('Por favor, completa todos los campos.');
      } else if (this.password() !== this.confirmPassword()) {
        this.errorMessage.set('Las contraseñas no coinciden.');
      } else {
        this.successMessage.set('¡Registro exitoso! Ahora puedes iniciar sesión.');
        this.setMode('login');
      }
      this.loading.set(false);
    }, 500);
  }

  handleForgotPassword() {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Lógica de contraseña olvidada simulada
    setTimeout(() => {
      if (this.email()) {
        this.successMessage.set('Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.');
        this.setMode('login');
      } else {
        this.errorMessage.set('Por favor, introduce tu correo electrónico.');
      }
      this.loading.set(false);
    }, 500);
  }
}
