# Firebase Image Converter Extension

自动转换和优化上传到 Firebase Storage 的图片文件。

## 功能特点
- 自动转换图片格式（支持 HEIC/PNG/WEBP ↔ JPG）
- 智能图片压缩
- 自动生成缩略图
- 支持批量处理
- 可配置的输出选项

## 技术架构
- Firebase Cloud Functions
- Node.js
- Sharp 图片处理库

## 使用场景
- 移动应用上传图片处理
- 产品图片管理系统
- 用户头像处理
- 图片资源优化

## 快速开始

### 安装
1. 在 Firebase Console 中安装扩展
2. 配置必要的参数
3. 部署扩展

### 基本使用
```javascript
// 上传图片示例
const uploadImage = async (file) => {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(`images/${file.name}`);
  await imageRef.put(file);
  // 文件会自动处理
};
```

## 配置选项
- TARGET_FORMAT: 目标格式 (jpg/png/webp)
- QUALITY: 输出质量 (1-100)
- GENERATE_THUMBNAIL: 是否生成缩略图
- THUMBNAIL_SIZE: 缩略图尺寸
- PRESERVE_ORIGINAL: 是否保留原文件

## 贡献
欢迎提交 Pull Request 或创建 Issue。

## 许可证
MIT License
