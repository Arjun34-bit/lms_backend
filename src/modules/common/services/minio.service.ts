import { envConstant } from '@constants/index';
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { FileTypeEnum } from '@prisma/client';
import { Client } from 'minio';
import { PrismaService } from 'src/prisma/prisma.service';

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
  ) {
    try {
      if (!buffer) {
        throw new InternalServerErrorException('File buffer is empty or undefined');
      }
      
      await this.minioClient.putObject(bucket, objectKey, buffer);
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

  async getFileUrl(bucket: string, objectKey: string): Promise<string> {
    if (bucket === 'pcc-public') {
      return `${envConstant.MINIO_BASE_URL}/api/v1/buckets/${bucket}/objects/download?prefix=${objectKey}`;
    }
    return this.minioClient.presignedGetObject(bucket, objectKey);
  }
}
