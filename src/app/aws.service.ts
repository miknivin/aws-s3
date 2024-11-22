import { Injectable } from '@angular/core';
import { PutObjectCommand, PutObjectCommandInput, S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AwsService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: environment.aws.region,
      credentials: {
        accessKeyId: environment.aws.accessKeyId,
        secretAccessKey: environment.aws.secretAccessKey,
      },
    });
  }

  async uploadFile(file: File, bucketName: string) {
    const folderName = 'photos'; // Folder name inside your bucket
    const params: PutObjectCommandInput = {
      Bucket: bucketName, // Bucket name
      Key: `${folderName}/${file.name}`, // Folder and file name
      Body: file,
      ContentType: file.type, // Set the content type of the file
    };
    try {
      console.log('Uploading file to S3:', params); // Log the upload params for debugging
      await this.s3Client.send(new PutObjectCommand(params)); // Upload file
      return `https://${bucketName}.s3.${this.s3Client.config.region}.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      throw new Error('File upload failed');
    }
  }

  async listFiles(bucketName: string): Promise<string[]> {
    const command = new ListObjectsCommand({ Bucket: bucketName });
    try {
      const response = await this.s3Client.send(command);
      const files = response.Contents?.map((item) => item.Key || '') || [];
      const region = environment.aws.region; // Use the environment variable for the region
      return files.map((key) => `https://${bucketName}.s3.${region}.amazonaws.com/${key}`);
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to retrieve files from S3');
    }
  }
}
