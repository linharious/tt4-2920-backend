import { inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { TaskItem } from './models';

export interface TaskEvent {
  type: 'created' | 'updated' | 'deleted';
  task?: TaskItem;
  taskId?: string;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private readonly authService = inject(AuthService);
  private readonly ngZone = inject(NgZone);

  private socket: Socket | null = null;
  private taskEventsSubject = new BehaviorSubject<TaskEvent | null>(null);
  public taskEvents$ = this.taskEventsSubject.asObservable();
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  public isConnected$ = this.isConnectedSubject.asObservable();

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token available for WebSocket connection');
      return;
    }

    // Run socket connection outside Angular zone to prevent change detection spam
    this.ngZone.runOutsideAngular(() => {
      this.socket = io(environment.apiUrl, {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        this.ngZone.run(() => {
          console.log('WebSocket connected');
          this.isConnectedSubject.next(true);
        });
      });

      this.socket.on('disconnect', () => {
        this.ngZone.run(() => {
          console.log('WebSocket disconnected');
          this.isConnectedSubject.next(false);
        });
      });

      // Listen for task events
      this.socket.on('task:created', (data: { type: string; task: TaskItem }) => {
        this.ngZone.run(() => {
          this.taskEventsSubject.next({ type: 'created', task: data.task });
        });
      });

      this.socket.on('task:updated', (data: { type: string; task: TaskItem }) => {
        this.ngZone.run(() => {
          this.taskEventsSubject.next({ type: 'updated', task: data.task });
        });
      });

      this.socket.on('task:deleted', (data: { type: string; taskId: string }) => {
        this.ngZone.run(() => {
          this.taskEventsSubject.next({ type: 'deleted', taskId: data.taskId });
        });
      });

      this.socket.on('error', (error: string) => {
        this.ngZone.run(() => {
          console.error('WebSocket error:', error);
        });
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnectedSubject.next(false);
    }
  }

  isConnected(): boolean {
    return this.isConnectedSubject.value;
  }
}
