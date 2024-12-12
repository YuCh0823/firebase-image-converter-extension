import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { ObjectMetadata } from 'firebase-functions/v1/storage';
import { StorageFileInfo } from '../config/types';

const mkdtemp = promisify(fs.mkdtemp);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);

export class FileUtils {
  /**
   * 创建临时目录
   */
  static async createTempDir(): Promise<string> {
    const tempPath = path.join(os.tmpdir(), 'image-converter-');
    return await mkdtemp(tempPath);
  }

  /**
   * 清理临时文件和目录
   */
  static async cleanup(filepath: string, directory?: string): Promise<void> {
    try {
      if (fs.existsSync(filepath)) {
        await unlink(filepath);
      }
      
      if (directory && fs.existsSync(directory)) {
        await rmdir(directory);
      }
    } catch (error) {
      console.error('Error cleaning up files:', error);
    }
  }

  /**
   * 生成临时文件路径
   */
  static generateTempFilePath(originalName: string, tempDir: string): string {
    return path.join(tempDir, path.basename(originalName));
  }

  /**
   * 获取文件 MIME 类型
   */
  static getMimeType(format: string): string {
    const mimeTypes: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      heic: 'image/heic',
    };

    return mimeTypes[format.toLowerCase()] || 'application/octet-stream';
  }

  /**
   * 解析存储文件信息
   */
  static parseStorageFileInfo(object: ObjectMetadata): StorageFileInfo {
    return {
      bucket: object.bucket || '',
      name: object.name || '',
      contentType: object.contentType || 'application/octet-stream',
      size: Number(object.size) || 0,
      metadata: object.metadata || {},
    };
  }
}
