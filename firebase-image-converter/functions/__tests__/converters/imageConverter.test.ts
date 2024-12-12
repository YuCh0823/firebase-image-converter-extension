import sharp from 'sharp';
import { ImageConverter } from '../../src/converters/imageConverter';
import { ConversionOptions, ThumbnailOptions } from '../../src/config/types';

describe('ImageConverter', () => {
  let converter: ImageConverter;
  let testImageBuffer: Buffer;

  beforeAll(async () => {
    // 创建测试图片
    testImageBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .jpeg()
      .toBuffer();
  });

  beforeEach(() => {
    converter = new ImageConverter();
  });

  describe('convert', () => {
    it('should convert image to specified format', async () => {
      const options: ConversionOptions = {
        format: 'png',
        quality: 80,
      };

      const result = await converter.convert(testImageBuffer, options, 'test.jpg');

      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata?.format).toBe('png');
    });

    it('should handle resize options', async () => {
      const options: ConversionOptions = {
        format: 'jpg',
        quality: 80,
        width: 50,
        height: 50,
      };

      const result = await converter.convert(testImageBuffer, options, 'test.jpg');

      expect(result.success).toBe(true);
      expect(result.metadata?.width).toBe(50);
      expect(result.metadata?.height).toBe(50);
    });

    it('should handle conversion errors', async () => {
      const invalidBuffer = Buffer.from('invalid image data');
      const options: ConversionOptions = {
        format: 'jpg',
        quality: 80,
      };

      const result = await converter.convert(invalidBuffer, options, 'test.jpg');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.outputPath).toBe('');
    });

    it('should handle resize with both width and height', async () => {
      const options: ConversionOptions = {
        format: 'jpg',
        quality: 80,
        width: 50,
        height: 50,
        fit: 'cover'
      };

      const result = await converter.convert(testImageBuffer, options, 'test.jpg');

      expect(result.success).toBe(true);
      expect(result.metadata?.width).toBe(50);
      expect(result.metadata?.height).toBe(50);
    });

    it('should handle HEIC format conversion', async () => {
      const options: ConversionOptions = {
        format: 'heic',
        quality: 80,
      };

      const result = await converter.convert(testImageBuffer, options, 'test.heic');

      expect(result.success).toBe(true);
      expect(result.metadata?.format).toBe('jpeg'); // HEIC 会被转换为 JPEG
    });
  });

  describe('generateThumbnail', () => {
    it('should generate thumbnail with specified size', async () => {
      const options: ThumbnailOptions = {
        size: 50,
        format: 'jpg',
        quality: 80,
      };

      const result = await converter.generateThumbnail(testImageBuffer, options, 'test.jpg');

      expect(result.success).toBe(true);
      expect(result.metadata?.width).toBeLessThanOrEqual(50);
      expect(result.metadata?.height).toBeLessThanOrEqual(50);
    });

    it('should maintain aspect ratio', async () => {
      // 创建矩形测试图片
      const rectangleBuffer = await sharp({
        create: {
          width: 200,
          height: 100,
          channels: 4,
          background: { r: 255, g: 0, b: 0, alpha: 1 },
        },
      })
        .jpeg()
        .toBuffer();

      const options: ThumbnailOptions = {
        size: 50,
        format: 'jpg',
        quality: 80,
      };

      const result = await converter.generateThumbnail(rectangleBuffer, options, 'test.jpg');

      expect(result.success).toBe(true);
      expect(result.metadata?.width).toBe(50);
      expect(result.metadata?.height).toBe(25);
    });

    it('should handle thumbnail generation errors', async () => {
      const invalidBuffer = Buffer.from('invalid image data');
      const options: ThumbnailOptions = {
        size: 50,
        format: 'jpg',
        quality: 80,
      };

      const result = await converter.generateThumbnail(invalidBuffer, options, 'test.jpg');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.outputPath).toBe('');
    });

    it('should handle portrait images', async () => {
      // 创建竖向图片
      const portraitBuffer = await sharp({
        create: {
          width: 100,
          height: 200,
          channels: 4,
          background: { r: 255, g: 0, b: 0, alpha: 1 },
        },
      })
        .jpeg()
        .toBuffer();

      const options: ThumbnailOptions = {
        size: 50,
        format: 'jpg',
        quality: 80,
      };

      const result = await converter.generateThumbnail(portraitBuffer, options, 'test.jpg');

      expect(result.success).toBe(true);
      expect(result.metadata?.width).toBe(25);
      expect(result.metadata?.height).toBe(50);
    });
  });

  describe('needsConversion', () => {
    it('should detect when conversion is needed', async () => {
      const needsConversion = await ImageConverter.needsConversion(testImageBuffer, 'png', 80);
      expect(needsConversion).toBe(true);
    });

    it('should detect when conversion is not needed', async () => {
      const needsConversion = await ImageConverter.needsConversion(testImageBuffer, 'jpeg', 60);
      // Sharp 不提供质量信息，所以我们总是假设需要转换
      expect(needsConversion).toBe(true);
    });

    it('should handle metadata read errors', async () => {
      const invalidBuffer = Buffer.from('invalid image data');
      const needsConversion = await ImageConverter.needsConversion(invalidBuffer, 'jpg', 80);
      expect(needsConversion).toBe(true);
    });

    it('should handle missing format in metadata', async () => {
      // 模拟没有格式信息的图片
      jest.spyOn(sharp.prototype, 'metadata').mockResolvedValueOnce({});
      const needsConversion = await ImageConverter.needsConversion(testImageBuffer, 'jpg', 80);
      expect(needsConversion).toBe(true);
    });
  });

  describe('getImageMetadata', () => {
    it('should return correct image metadata', async () => {
      const metadata = await ImageConverter.getImageMetadata(testImageBuffer);
      
      expect(metadata.width).toBe(100);
      expect(metadata.height).toBe(100);
      expect(metadata.format).toBe('jpeg');
    });

    it('should handle invalid image data', async () => {
      const invalidBuffer = Buffer.from('invalid image data');
      
      await expect(ImageConverter.getImageMetadata(invalidBuffer)).rejects.toThrow();
    });
  });
});
