# 配置指南

恭喜！Firebase Image Converter 已安装成功。请按照以下步骤完成配置：

## 1. 基础配置

### 存储规则设置
确保你的 Firebase Storage 规则允许适当的访问：

```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 输出配置
在 Firebase Console 中设置以下参数：
- TARGET_FORMAT: 目标格式 (jpg/png/webp)
- QUALITY: 输出质量 (1-100)
- GENERATE_THUMBNAIL: 是否生成缩略图
- THUMBNAIL_SIZE: 缩略图尺寸
- PRESERVE_ORIGINAL: 是否保留原文件

## 2. 使用方法

### 基本用法
1. 将图片上传到 Storage 指定目录
2. 扩展自动处理并输出转换后的文件
3. 可在原始文件同目录下找到处理后的文件

### 文件命名规则
- 转换后文件：`{原文件名}.{目标格式}`
- 缩略图：`{原文件名}_thumb.{目标格式}`

### 代码示例
```javascript
// 上传文件示例
const uploadImage = async (file) => {
  const storageRef = firebase.storage().ref();
  const imageRef = storageRef.child(`images/${file.name}`);
  await imageRef.put(file);
  // 文件会自动处理
};
```

## 3. 监控和故障排除

### 查看日志
1. 访问 Firebase Console
2. 转到 Functions 日志
3. 筛选扩展相关日志

### 常见问题
1. 文件未转换
   - 检查存储规则
   - 验证文件格式是否支持
   - 查看函数日志

2. 性能问题
   - 调整内存配置
   - 检查文件大小
   - 优化上传策略

## 4. 最佳实践
- 使用适当的文件命名
- 定期清理未使用的文件
- 监控存储空间使用情况
- 设置适当的安全规则

## 5. 获取支持
- GitHub Issues: [项目地址]
- 文档: [文档链接]
- 邮件支持: [support@example.com]
