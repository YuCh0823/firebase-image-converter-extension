import { FileUtils } from '../../src/utils/file';
import { ObjectMetadata } from 'firebase-functions/v1/storage';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('firebase-functions');

describe('FileUtils', () => {
  describe('createTempDir', () => {
    it('should create a temporary directory', async () => {
      const tempDir = await FileUtils.createTempDir();
      
      expect(fs.existsSync(tempDir)).toBe(true);
      
      // 清理
      fs.rmdirSync(tempDir);
    });
  });

  describe('cleanup', () => {
    it('should clean up files and directories', async () => {
      // 创建测试文件和目录
      const tempDir = await FileUtils.createTempDir();
      const tempFile = path.join(tempDir, 'test.txt');
      fs.writeFileSync(tempFile, 'test');

      await FileUtils.cleanup(tempFile, tempDir);

      expect(fs.existsSync(tempFile)).toBe(false);
      expect(fs.existsSync(tempDir)).toBe(false);
    });

    it('should handle non-existent files', async () => {
      await expect(FileUtils.cleanup('non-existent-file.txt')).resolves.not.toThrow();
    });
  });

  describe('generateTempFilePath', () => {
    it('should generate correct temp file path', () => {
      const originalName = 'test.jpg';
      const tempDir = '/tmp';
      const expected = path.join('/tmp', 'test.jpg');

      expect(FileUtils.generateTempFilePath(originalName, tempDir)).toBe(expected);
    });
  });

  describe('getMimeType', () => {
    it('should return correct MIME types', () => {
      expect(FileUtils.getMimeType('jpg')).toBe('image/jpeg');
      expect(FileUtils.getMimeType('png')).toBe('image/png');
      expect(FileUtils.getMimeType('webp')).toBe('image/webp');
      expect(FileUtils.getMimeType('unknown')).toBe('application/octet-stream');
    });
  });

  describe('parseStorageFileInfo', () => {
    it('should parse storage object metadata correctly', () => {
      const mockMetadata: ObjectMetadata = {
        kind: 'storage#object',
        id: 'test-id',
        bucket: 'test-bucket',
        name: 'test.jpg',
        contentType: 'image/jpeg',
        size: '1024',
        storageClass: 'STANDARD',
        timeCreated: new Date().toISOString(),
        updated: new Date().toISOString(),
        generation: '1',
        metageneration: '1',
        metadata: {
          custom: 'value'
        }
      };

      const info = FileUtils.parseStorageFileInfo(mockMetadata);

      expect(info).toEqual({
        bucket: 'test-bucket',
        name: 'test.jpg',
        contentType: 'image/jpeg',
        size: 1024,
        metadata: {
          custom: 'value'
        }
      });
    });

    it('should handle missing optional fields', () => {
      const mockMetadata: ObjectMetadata = {
        kind: 'storage#object',
        id: 'test-id',
        bucket: 'test-bucket',
        name: 'test.jpg',
        storageClass: 'STANDARD',
        timeCreated: new Date().toISOString(),
        updated: new Date().toISOString(),
        generation: '1',
        metageneration: '1',
        size: '0'
      };

      const info = FileUtils.parseStorageFileInfo(mockMetadata);

      expect(info).toEqual({
        bucket: 'test-bucket',
        name: 'test.jpg',
        contentType: 'application/octet-stream',
        size: 0,
        metadata: {}
      });
    });
  });
});
