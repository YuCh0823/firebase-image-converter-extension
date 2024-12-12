import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ImageConverter } from './converters/imageConverter';
import { loadConfig, isSupportedImage, generateOutputPath } from './config/config';
import { Logger } from './utils/logger';
import { FileUtils } from './utils/file';
import { ConversionOptions, ThumbnailOptions } from './config/types';

// 初始化 Firebase Admin
admin.initializeApp();

const logger = new Logger('Main');

/**
 * 主函数：处理文件上传事件
 */
export const convertImage = functions.storage.object().onFinalize(async (object) => {
  try {
    // 加载配置
    const config = loadConfig();
    
    // 解析文件信息
    const fileInfo = FileUtils.parseStorageFileInfo(object);
    
    // 检查是否需要处理此文件
    if (!isSupportedImage(fileInfo.name, config.allowedFormats)) {
      logger.info('Skipping unsupported file', { filename: fileInfo.name });
      return null;
    }

    // 创建临时目录
    const tempDir = await FileUtils.createTempDir();
    const tempFilePath = FileUtils.generateTempFilePath(fileInfo.name, tempDir);

    try {
      // 下载文件
      const bucket = admin.storage().bucket(fileInfo.bucket);
      const file = bucket.file(fileInfo.name);
      await file.download({ destination: tempFilePath });

      // 读取文件内容
      const inputBuffer = await file.download();
      
      // 创建转换器实例
      const converter = new ImageConverter();

      // 检查是否需要转换
      const needsConversion = await ImageConverter.needsConversion(
        inputBuffer[0],
        config.targetFormat,
        config.quality
      );

      if (needsConversion) {
        // 转换图片
        const conversionOptions: ConversionOptions = {
          format: config.targetFormat,
          quality: config.quality,
        };

        const result = await converter.convert(inputBuffer[0], conversionOptions, fileInfo.name);

        if (result.success) {
          // 上传转换后的文件
          const outputPath = generateOutputPath(fileInfo.name, config.targetFormat);
          await bucket.upload(result.outputPath, {
            destination: outputPath,
            metadata: {
              contentType: FileUtils.getMimeType(config.targetFormat),
              metadata: {
                converted: 'true',
                originalFormat: fileInfo.contentType,
              },
            },
          });

          // 如果不保留原文件，则删除
          if (!config.preserveOriginal) {
            await file.delete();
          }
        }
      }

      // 生成缩略图（如果启用）
      if (config.generateThumbnail && config.thumbnailSize) {
        const thumbnailOptions: ThumbnailOptions = {
          size: config.thumbnailSize,
          format: config.targetFormat,
          quality: config.quality,
        };

        const thumbnailResult = await converter.generateThumbnail(
          inputBuffer[0],
          thumbnailOptions,
          fileInfo.name
        );

        if (thumbnailResult.success) {
          // 上传缩略图
          const thumbnailPath = generateOutputPath(fileInfo.name, config.targetFormat, true);
          await bucket.upload(thumbnailResult.outputPath, {
            destination: thumbnailPath,
            metadata: {
              contentType: FileUtils.getMimeType(config.targetFormat),
              metadata: {
                thumbnail: 'true',
                originalImage: fileInfo.name,
              },
            },
          });
        }
      }

    } finally {
      // 清理临时文件
      await FileUtils.cleanup(tempFilePath, tempDir);
    }

    return null;
  } catch (error) {
    logger.error('Error processing file', error);
    throw error;
  }
});

// 导出配置验证函数（用于扩展安装时的配置验证）
export const validateConfig = functions.handler.storage.object.onChange(async (data, context) => {
  try {
    loadConfig();
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error during config validation',
    };
  }
});
