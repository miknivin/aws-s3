import { Component, OnInit } from '@angular/core';
import { AwsService } from '../aws.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  selectedFile: File | null = null;
  files: string[] = [];

  constructor(private s3UploaderService: AwsService) {}

  async ngOnInit(): Promise<void> {
    try {
      const bucketName = 'examplebucketjasim'; // Your bucket name
      this.files = await this.s3UploaderService.listFiles(bucketName);
      console.log(this.files);

    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async fetchFiles() {
    const bucketName = 'examplebucketjasim'; // Replace with your bucket name
    try {
      this.files = await this.s3UploaderService.listFiles(bucketName);
      console.log(this.files,'files');

    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }

  async uploadFile() {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    try {
      const bucketName = 'examplebucketjasim';  // Replace with your actual S3 bucket name
      // Now passing only the file and bucketName, no folderName argument
      const fileUrl = await this.s3UploaderService.uploadFile(this.selectedFile, bucketName);
      console.log('File uploaded successfully:', fileUrl);
      alert(`File uploaded successfully: ${fileUrl}`);
    } catch (error) {
      console.error('Error during upload:', error);
      alert('File upload failed.');
    }
  }
}
