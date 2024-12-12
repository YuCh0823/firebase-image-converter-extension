import * as functions from 'firebase-functions';
import { ExtensionConfig, ImageFormat } from './types';

/**
 * 从环境变量加载配置
 */
export function loadConfig(): ExtensionConfig {
  const config = functions.config().imageconverter || {};

  // 验证和转换允许的格式
  const allowedFormats = (config.allowed_formats || 'jpg,jpeg,png,webp,heic')
    .split(',')
    .map((format: string) => format.trim().toLowerCase());

  // 验证目标格式
  const targetFormat = (config.target_format || 'jpg').toLowerCase() as ImageFormat;
  if (!isValidImageFormat(targetFormat)) {
    throw new Error(`Invalid target format: ${targetFormat}`);
  }

  // 验证质量值
  const quality = Number(config.quality || 80);
  if (quality < 1 || quality > 100) {
    throw new Error('Quality must be between 1 and 100');
  }

  // 验证缩略图尺寸
  const thumbnailSize = config.generate_thumbnail ? Number(config.thumbnail_size || 200) : undefined;
  if (thumbnailSize && (thumbnailSize < 1 || thumbnailSize > 9999)) {
    throw new Error('Thumbnail size must be between 1 and 9999');
  }

  return {
    location: config.location || 'us-central1',
    imgBucket: config.img_bucket || '',
    targetFormat,
    quality,
    generateThumbnail: Boolean(config.generate_thumbnail),
    thumbnailSize,
    preserveOriginal: Boolean(config.preserve_original),
    allowedFormats,
  };
}

/**
 * 验证图片格式是否支持
 */
function isValidImageFormat(format: string): format is ImageFormat {
  const validFormats: ImageFormat[] = ['jpg', 'jpeg', 'png', 'webp', 'heic'];
  return validFormats.includes(format as ImageFormat);
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return ext === 'jpeg' ? 'jpg' : ext;
}

/**
 * 检查文件是否为支持的图片格式
 */
export function isSupportedImage(filename: string, allowedFormats: string[]): boolean {
  const ext = getFileExtension(filename);
  return allowedFormats.includes(ext);
}

/**
 * 生成输出文件路径
 */
export function generateOutputPath(
  originalPath: string,
  targetFormat: ImageFormat,
  isThumbnail = false
): string {
  const pathParts = originalPath.split('.');
  pathParts.pop(); // 移除原始扩展名
  const basePath = pathParts.join('.');
  
  return `${basePath}${isThumbnail ? '_thumb' : ''}.${targetFormat}`;
}
