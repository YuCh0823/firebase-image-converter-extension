import { loadConfig, isSupportedImage, generateOutputPath } from '../../src/config/config';
import { ImageFormat } from '../../src/config/types';
import * as functions from 'firebase-functions';

jest.mock('firebase-functions');

describe('Config Module', () => {
  describe('loadConfig', () => {
    beforeEach(() => {
      // 重置 mock
      jest.resetAllMocks();
    });

    it('should load config with default values', () => {
      // 设置默认配置
      (functions.config as jest.Mock).mockReturnValue({
        imageconverter: {
          location: 'us-central1',
          img_bucket: 'test-bucket',
          target_format: 'jpg',
          quality: '80',
          generate_thumbnail: 'true',
          thumbnail_size: '200',
          preserve_original: 'true',
          allowed_formats: 'jpg,jpeg,png,webp,heic'
        }
      });

      const config = loadConfig();
      
      expect(config).toEqual({
        location: 'us-central1',
        imgBucket: 'test-bucket',
        targetFormat: 'jpg',
        quality: 80,
        generateThumbnail: true,
        thumbnailSize: 200,
        preserveOriginal: true,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'heic'],
      });
    });

    it('should throw error for invalid quality value', () => {
      // 设置无效的质量值
      (functions.config as jest.Mock).mockReturnValue({
        imageconverter: {
          quality: '101'
        }
      });

      expect(() => loadConfig()).toThrow('Quality must be between 1 and 100');
    });

    it('should throw error for invalid thumbnail size', () => {
      (functions.config as jest.Mock).mockReturnValue({
        imageconverter: {
          generate_thumbnail: 'true',
          thumbnail_size: '10000'
        }
      });

      expect(() => loadConfig()).toThrow('Thumbnail size must be between 1 and 9999');
    });

    it('should handle missing values', () => {
      (functions.config as jest.Mock).mockReturnValue({
        imageconverter: {}
      });

      const config = loadConfig();
      expect(config).toEqual({
        location: 'us-central1',
        imgBucket: '',
        targetFormat: 'jpg',
        quality: 80,
        generateThumbnail: false,
        thumbnailSize: undefined,
        preserveOriginal: false,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'heic'],
      });
    });

    it('should handle invalid target format', () => {
      (functions.config as jest.Mock).mockReturnValue({
        imageconverter: {
          target_format: 'invalid'
        }
      });

      expect(() => loadConfig()).toThrow('Invalid target format: invalid');
    });
  });

  describe('isSupportedImage', () => {
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];

    it('should return true for supported formats', () => {
      expect(isSupportedImage('test.jpg', allowedFormats)).toBe(true);
      expect(isSupportedImage('test.png', allowedFormats)).toBe(true);
      expect(isSupportedImage('test.webp', allowedFormats)).toBe(true);
    });

    it('should return false for unsupported formats', () => {
      expect(isSupportedImage('test.gif', allowedFormats)).toBe(false);
      expect(isSupportedImage('test.bmp', allowedFormats)).toBe(false);
    });

    it('should handle files without extension', () => {
      expect(isSupportedImage('testfile', allowedFormats)).toBe(false);
    });
  });

  describe('generateOutputPath', () => {
    it('should generate correct output path', () => {
      const originalPath = 'images/test.jpg';
      const targetFormat: ImageFormat = 'png';
      
      expect(generateOutputPath(originalPath, targetFormat)).toBe('images/test.png');
    });

    it('should generate thumbnail path when specified', () => {
      const originalPath = 'images/test.jpg';
      const targetFormat: ImageFormat = 'webp';
      
      expect(generateOutputPath(originalPath, targetFormat, true)).toBe('images/test_thumb.webp');
    });

    it('should handle paths with multiple dots', () => {
      const originalPath = 'images/test.image.jpg';
      const targetFormat: ImageFormat = 'png';
      
      expect(generateOutputPath(originalPath, targetFormat)).toBe('images/test.image.png');
    });
  });
});
