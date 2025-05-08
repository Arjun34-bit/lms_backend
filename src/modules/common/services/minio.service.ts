import { envConstant } from '@constants/index';
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { FileTypeEnum } from '@prisma/client';
import { Client } from 'minio';
import { PrismaService } from 'src/prisma/prisma.service';
import * as mime from 'mime-types';

@Injectable()
export class MinioService {
  private readonly minioClient: Client;

  constructor(private readonly prisma: PrismaService) {
   
    this.minioClient = new Client({
      endPoint: envConstant.MINIO_BASE_URL,
      port: 443,
      useSSL: true,
      accessKey: envConstant.MINIO_ACCESS_KEY,
      secretKey: envConstant.MINIO_SECRET_KEY,
      pathStyle: true,
    });
  }

  async uploadFile(
    bucket: string,
    buffer: Buffer,
    objectKey: string,
    fileType: FileTypeEnum = FileTypeEnum.image,
    forDownload: boolean = false
  ) {
    try {
      if (!buffer) {
        throw new InternalServerErrorException('File buffer is empty or undefined');
      }
      
      const contentType = mime.lookup(objectKey) || 'application/octet-stream';
      const fileName = encodeURIComponent(objectKey.split('/').pop() || objectKey);
      const disposition = forDownload ? `attachment; filename*=UTF-8''${fileName}` : 'inline';

      const metadata = {
        'Content-Type': contentType,
        'Content-Disposition': disposition,
        'Cache-Control': 'max-age=86400'
      };

      await this.minioClient.putObject(
        bucket,
        objectKey,
        buffer,
        buffer.length,
        metadata
      );
      const fileData = await this.prisma.files.create({
        data: {
          bucketName: bucket,
          objectKey,
          fileType,
        },
      });
      return {
        fileData,
        bucket,
        objectKey,
      };
    } catch (error) {
      console.log(error);
      Logger.error(error?.stack);
      throw new InternalServerErrorException('Failed to upload thumbnail: ' + error.message);
    }
  }

  async getFileStream(bucket: string, objectKey: string) {
    return this.minioClient.getObject(bucket, objectKey);
  }

  async getFileUrl(bucket: string, objectKey: string, forDownload: boolean = false): Promise<string> {
    try {
      if (bucket === 'pcc-public') {
        return `https://${envConstant.MINIO_BASE_URL}/${bucket}/${objectKey}`;
      }
      const contentType = mime.lookup(objectKey) || 'application/octet-stream';
      const fileName = encodeURIComponent(objectKey.split('/').pop() || objectKey);
      const disposition = forDownload ? `attachment; filename*=UTF-8''${fileName}` : 'inline';
      const reqParams = {
        'Content-Type': contentType,
        'response-content-disposition': disposition,
        'response-cache-control': 'max-age=86400'
      };
      return this.minioClient.presignedGetObject(bucket, objectKey, 24 * 60 * 60, reqParams);
    } catch (error) {
      Logger.error(error?.stack);
      throw new InternalServerErrorException('Failed to generate file URL: ' + error.message);
    }
  }
}