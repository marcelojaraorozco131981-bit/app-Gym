import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileModalComponent implements OnInit, OnDestroy {
  user = input.required<User>();
  close = output<void>();
  save = output<Partial<User>>();

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
  @ViewChild('videoElement') videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement?: ElementRef<HTMLCanvasElement>;

  // Form fields
  name = signal('');
  email = signal('');
  phone = signal('');
  avatarUrl = signal(''); // Holds the base64 data URL of the new/current image

  // Camera state
  isCameraOpen = signal(false);
  snapshot = signal<string | null>(null);
  stream: MediaStream | null = null;

  ngOnInit() {
    this.name.set(this.user().name);
    this.email.set(this.user().email);
    this.phone.set(this.user().phone || '');
    this.avatarUrl.set(this.user().avatarUrl);
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  onSave() {
    const updatedData: Partial<User> = {
      name: this.name(),
      email: this.email(),
      phone: this.phone(),
      avatarUrl: this.avatarUrl(),
    };
    this.save.emit(updatedData);
  }

  onClose() {
    this.close.emit();
  }

  // --- File Upload Logic ---
  triggerFileInput() {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // --- Camera Logic ---
  async openCamera() {
    this.isCameraOpen.set(true);
    this.snapshot.set(null);
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      this.isCameraOpen.set(false);
    }
  }

  closeCamera() {
    this.stopCamera();
    this.isCameraOpen.set(false);
    this.snapshot.set(null);
  }

  stopCamera() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  takeSnapshot() {
    if (this.videoElement && this.canvasElement) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      this.snapshot.set(dataUrl);
      this.stopCamera(); // Stop stream after taking picture
    }
  }

  retakePhoto() {
    this.snapshot.set(null);
    this.openCamera(); // Re-initialize camera
  }
  
  confirmSnapshot() {
    if (this.snapshot()) {
      this.avatarUrl.set(this.snapshot()!);
    }
    this.closeCamera();
  }
}
