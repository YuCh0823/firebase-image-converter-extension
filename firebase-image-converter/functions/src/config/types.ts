/**
 * 支持的图片格式
 */
export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'heic';

/**
 * 扩展配置接口
 */
export interface ExtensionConfig {
  location: string;
  imgBucket: string;
  targetFormat: ImageFormat;
  quality: number;
  generateThumbnail: boolean;
  thumbnailSize?: number;
  preserveOriginal: boolean;
  allowedFormats: string[];
}

/**
 * 图片转换配置接口
 */
export interface ConversionOptions {
  format: ImageFormat;
  quality: number;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * 转换结果接口
 */
export interface ConversionResult {
  success: boolean;
  error?: Error;
  metadata?: {
    format: string;
    width: number;
    height: number;
    size: number;
  };
  outputPath: string;
}

/**
 * 缩略图配置接口
 */
export interface ThumbnailOptions {
  size: number;
  format: ImageFormat;
  quality: number;
}

/**
 * 存储文件信息接口
 */
export interface StorageFileInfo {
  bucket: string;
  name: string;
  contentType: string;
  size: number;
  metadata: {
    [key: string]: string;
  };
}
