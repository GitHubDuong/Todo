import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { DatePipe } from "@angular/common";
import { TranslationService } from "@app/service/translation.service";
import { TimekeepingService } from "@app/service/timekeeping.service";
import {
  FaceDetectorComponent
} from '@components/timekeeping-module/timekeeping-checkin/face-detector/face-detetor.component';
import { take } from 'rxjs';
import { AuthService } from '@app/service/auth.service';
import { NotificationService } from '@app/service/notification.service';

@Component({
  selector: 'app-timekeeping-checkin',
  templateUrl: './timekeeping-checkin.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./timekeeping-checkin.component.scss'],
})

export class TimekeepingCheckinComponent implements OnInit {
  timeline: any[];
  colors: any = {
    passed: '#008000',
    unPassed: '#C0C0C0',
    inProgress: '#FFA500'
  }
  latitude: any;
  longitude: any;
  location: any;
  deviceId: string;
  currentUser: any;
  @ViewChild("faceDetectorComponent") faceDetectorComponent: FaceDetectorComponent;

  constructor(
    private readonly timekeepingService: TimekeepingService,
    private authService: AuthService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private translationService: TranslationService) {
  }

  async ngOnInit() {
    this.getTimeline();
    this.getLocation();
    this.deviceId = await this.timekeepingService.getDeviceId();
    this.currentUser = this.authService.getCurrentUser;
  }

  getLocation(): void {
    this.location = null;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
          if (position) {
            console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude);
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.location = position.coords;
          }
        },
        (error: any) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  checkIn(event: any): void {
    this.faceDetectorComponent.processDetectFace()
      .pipe(take(1))
      .subscribe(imgUrl => {
      let formData: FormData = new FormData();
      formData.append('latitude', this.latitude);
      formData.append('longitude', this.longitude);
      formData.append('deviceId', this.deviceId);
      formData.append('timeFrameFrom', event.from);
      formData.append('timeFrameTo', event.to);
      formData.append('file', this.dataURItoBlob(imgUrl), 'captured-face.png');

      this.timekeepingService.identifyFaceFromImage(formData).subscribe((res: any) => {
        console.log("Current User" ,this.currentUser);
        console.log("Identify User" , res);

        if(res == null) {
          this.notificationService.error("Không thể xác định danh tính ngươi dùng");
          return;
        }

        if(this.currentUser.username != res.username) {
          this.notificationService.error("Danh tính người dùng không chính xác")
          return;
        }

        this.timekeepingService.checkIn(formData).subscribe((res: any) => {
          this.messageService.add({
            severity: 'success',
            detail: this.translationService.translate('label.action_success'),
          });
          this.setupTimeline(res);
        });

      })
    })
  }

  getTimeline() {
    this.timekeepingService.getCheckin().subscribe((res: any) => {
      this.setupTimeline(res);
    });
  }

  setupTimeline(res: any) {
    this.timeline = res.data.map(item => {
      const success = item.success == true;
      let icon = item.progress != 'PASSED' && !success ? PrimeIcons.FLAG : PrimeIcons.CHECK;
      let isInProgress = item.progress == 'IN_PROGRESS';

      let color = success
        ? this.colors.passed
        : isInProgress ? this.colors.inProgress : this.colors.unPassed;

      let date = item.submitTime
        ? new DatePipe('en-us').transform(
          new Date(item.submitTime),
          'HH:mm dd/MM/yyyy',
        )
        : item.progress == 'PASSED' ? this.translationService.translate("info.not_yet_started_timekeeping") : '';
      return {
        name: item.name,
        date: date,
        icon: icon,
        color: color,
        success: success,
        inProgress: isInProgress,
        type: item.type,
        from: item.from,
        to: item.to
      }
    });
  }

  capturedFaceBlob: Blob;
  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}
