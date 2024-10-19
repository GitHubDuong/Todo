import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { Observable, Subject } from 'rxjs';
@Component({
  selector: 'app-face-detector',
  templateUrl: './face-detector.component.html',
  styleUrls: ['./face-detector.component.scss']
})

export class FaceDetectorComponent implements OnInit {
  WIDTH = 440;
  HEIGHT = 280;
  @ViewChild('video',{ static: true })
  public video: ElementRef;
  @ViewChild('canvas',{ static: true })
  public canvasRef: ElementRef;
  isCaptured: boolean = false;
  constructor(private elRef: ElementRef) {}
  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  msg: string
  capturedImageUrl: string;
  isProcessing: boolean = false;
  @Output() onDetectedFace = new EventEmitter<any>();
  private faceDetectedSubject = new Subject<string>();
  visibleSidebar: boolean = false;
  isReady: boolean = false;

  async ngOnInit() {
      await Promise.all([
        await faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
        await faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
        await faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/models'),
        await faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),
      ]).then(() => this.isReady = true);
  }

  startVideo() {
    while (!this.isReady) {
      this.msg = "Đang tải dữ liệu. Vui lòng đợi"
      setTimeout(null ,1000)
    }

    this.videoInput = this.video.nativeElement;
    navigator.mediaDevices.getUserMedia(
      { video: true, audio: false }
    ).then(async (stream) => {
      this.videoInput.srcObject = stream;
      await this.detectFaces();
    }).catch((err) => console.log(err));
  }

  async detectFaces() {
    let video = this.elRef.nativeElement.querySelector('video') as HTMLVideoElement;
    this.elRef.nativeElement.querySelector('video').addEventListener('play', async () => {
      this.msg = "Vui lòng giữ yên thiết bị để nhận diện khuôn mặt";
      this.canvas = faceapi.createCanvasFromMedia(this.videoInput);
      this.canvasEl = this.canvasRef.nativeElement;
      this.displaySize = {
        width: this.videoInput.width,
        height: this.videoInput.height,
      };
      faceapi.matchDimensions(this.canvas, this.displaySize);

      while (!this.isCaptured) {
        this.isProcessing = true;
        this.detection = await faceapi.detectAllFaces(this.videoInput,  new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        this.resizedDetections = faceapi.resizeResults(
          this.detection,
          this.displaySize
        );
        if (this.resizedDetections.length > 0) {
          if (await this.isFaceClear(video)) {
            this.takePhoto(video);
          }
        } else {
          this.msg = "Không thể nhận diện. Vui lòng giữ yên thiết bị";
        }
        this.isProcessing = false;
      }
    });
  }

  async isFaceClear(video: HTMLVideoElement): Promise<boolean> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const grayscale = this.convertToGrayscale(imageData);
    const laplacian = this.applyLaplacian(grayscale, canvas.width, canvas.height);
    const variance = this.calculateVariance(laplacian);

    const blurThreshold = 100; // Set a threshold value to determine blurriness
    return variance >= blurThreshold;
  }

  takePhoto(video: HTMLVideoElement) {
    this.msg = "Đang chụp khuôn măt. Vui lòng giữ yên";
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      video.pause();
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImageUrl = canvas.toDataURL('image/png');
      this.msg = "Đã nhận diện khuôn mặt";
      this.faceDetectedSubject.next(this.capturedImageUrl);
      this.isCaptured = true;
      setTimeout(() => this.visibleSidebar = false, 1500)
    }
  }

  processDetectFace(): Observable<string> {
    this.visibleSidebar = true;
    this.isCaptured = false;
    this.startVideo();
    return this.faceDetectedSubject.asObservable();
  }

  convertToGrayscale(imageData: ImageData): Uint8ClampedArray {
    const grayscale = new Uint8ClampedArray(imageData.width * imageData.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      grayscale[i / 4] = avg;
    }
    return grayscale;
  }

  applyLaplacian(grayscale: Uint8ClampedArray, width: number, height: number): Float32Array {
    const laplacian = new Float32Array(grayscale.length);
    const kernel = [
      0, 1, 0,
      1, -4, 1,
      0, 1, 0
    ];
    const half = Math.floor(Math.sqrt(kernel.length) / 2);

    for (let y = half; y < height - half; y++) {
      for (let x = half; x < width - half; x++) {
        let sum = 0;
        for (let ky = -half; ky <= half; ky++) {
          for (let kx = -half; kx <= half; kx++) {
            const px = x + kx;
            const py = y + ky;
            const value = grayscale[py * width + px];
            const weight = kernel[(ky + half) * 3 + (kx + half)];
            sum += value * weight;
          }
        }
        laplacian[y * width + x] = sum;
      }
    }
    return laplacian;
  }

  calculateVariance(laplacian: Float32Array): number {
    const mean = laplacian.reduce((sum, value) => sum + value, 0) / laplacian.length;
    const variance = laplacian.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / laplacian.length;
    return variance;
  }
}
