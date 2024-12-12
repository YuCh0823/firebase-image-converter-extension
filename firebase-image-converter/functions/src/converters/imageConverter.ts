import sharp from 'sharp';
import { ConversionOptions, ConversionResult, ThumbnailOptions } from '../config/types';
import { Logger } from '../utils/logger';
import { FileUtils } from '../utils/file';

// 支持的输出格式
type SupportedOutputFormat = 'jpeg' | 'png' | 'webp';

export class ImageConverter {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ImageConverter');
  }

  /**
   * 获取支持的输出格式
   */
  private getOutputFormat(format: string): SupportedOutputFormat {
    const formatMap: { [key: string]: SupportedOutputFormat } = {
      jpg: 'jpeg',
      jpeg: 'jpeg',
      png: 'png',
      webp: 'webp',
      heic: 'jpeg', // HEIC 默认转换为 JPEG
    };
    return formatMap[format.toLowerCase()] || 'jpeg';
  }

  /**
   * 转换图片
   */
  async convert(
    inputBuffer: Buffer,
    options: ConversionOptions,
    originalFilename: string
  ): Promise<ConversionResult> {
    try {
      this.logger.info('Starting image conversion', { originalFilename, options });

      // 创建 Sharp 实例
      let image = sharp(inputBuffer);

      // 调整图片尺寸（如果指定）
      if (options.width || options.height) {
        image = image.resize(options.width, options.height, {
          fit: options.fit || 'inside',
          withoutEnlargement: true,
        });
      }

      // 转换格式和设置质量
      const outputFormat = this.getOutputFormat(options.format);
      const outputBuffer = await image
        .toFormat(outputFormat, {
          quality: options.quality,
          mozjpeg: outputFormat === 'jpeg',
          force: true,
        })
        .toBuffer({ resolveWithObject: true });

      return {
        success: true,
        metadata: {
          format: outputBuffer.info.format,
          width: outputBuffer.info.width,
          height: outputBuffer.info.height,
          size: outputBuffer.data.length,
        },
        outputPath: FileUtils.generateTempFilePath(originalFilename, ''),
      };
    } catch (error) {
      this.logger.error('Error converting image', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error during conversion'),
        outputPath: '',
      };
    }
  }

  /**
   * 生成缩略图
   */
  async generateThumbnail(
    inputBuffer: Buffer,
    options: ThumbnailOptions,
    originalFilename: string
  ): Promise<ConversionResult> {
    try {
      this.logger.info('Generating thumbnail', { originalFilename, options });

      // 创建 Sharp 实例
      const image = sharp(inputBuffer);

      // 获取原始图片的元数据
      const metadata = await image.metadata();
      const originalWidth = metadata.width || 0;
      const originalHeight = metadata.height || 0;

      // 计算缩略图尺寸，保持宽高比
      const aspectRatio = originalWidth / originalHeight;
      let thumbWidth = options.size;
      let thumbHeight = options.size;

      if (aspectRatio > 1) {
        thumbHeight = Math.round(options.size / aspectRatio);
      } else {
        thumbWidth = Math.round(options.size * aspectRatio);
      }

      // 生成缩略图
      const outputFormat = this.getOutputFormat(options.format);
      const outputBuffer = await image
        .resize(thumbWidth, thumbHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(outputFormat, {
          quality: options.quality,
          mozjpeg: outputFormat === 'jpeg',
          force: true,
        })
        .toBuffer({ resolveWithObject: true });

      return {
        success: true,
        metadata: {
          format: outputBuffer.info.format,
          width: outputBuffer.info.width,
          height: outputBuffer.info.height,
          size: outputBuffer.data.length,
        },
        outputPath: FileUtils.generateTempFilePath(originalFilename, ''),
      };
    } catch (error) {
      this.logger.error('Error generating thumbnail', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error generating thumbnail'),
        outputPath: '',
      };
    }
  }

  /**
   * 检查图片是否需要转换
   */
  static async needsConversion(
    inputBuffer: Buffer,
    targetFormat: string,
    quality: number
  ): Promise<boolean> {
    try {
      const metadata = await sharp(inputBuffer).metadata();
      
      // 检查格式是否需要转换
      const currentFormat = metadata.format;
      if (!currentFormat) return true;
      
      const normalizedTargetFormat = targetFormat === 'jpg' ? 'jpeg' : targetFormat;
      if (currentFormat !== normalizedTargetFormat) {
        return true;
      }

      // JPEG 质量检查
      if (normalizedTargetFormat === 'jpeg') {
        // Sharp 不提供质量信息，所以我们假设需要转换
        // 如果需要更精确的控制，可以使用其他库来读取 JPEG 质量
        return true;
      }

      return false;
    } catch (error) {
      // 如果无法读取元数据，假设需要转换
      return true;
    }
  }

  /**
   * 获取图片元数据
   */
  static async getImageMetadata(inputBuffer: Buffer): Promise<sharp.Metadata> {
    return await sharp(inputBuffer).metadata();
  }
}
