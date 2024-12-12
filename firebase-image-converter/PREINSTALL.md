# Firebase Image Converter

## 前置条件
在安装此扩展之前，请确保：

1. **Firebase 项目配置**
   - 已启用 Firebase Storage
   - 已启用 Cloud Functions
   - 已设置计费账户（此扩展需要 Blaze 计划）

2. **资源需求**
   - Cloud Functions: 默认内存 256MB
   - Storage: 根据图片处理量决定
   - 建议: 至少 1GB 的可用存储空间

3. **权限要求**
   - Storage 读写权限
   - Cloud Functions 部署权限

## 费用说明
此扩展使用以下 Firebase/Google Cloud 服务：
- Cloud Functions 调用
- Cloud Storage 存储和带宽
- 出站网络请求（如有）

## 配置建议
- 建议在测试环境中先进行测试
- 根据实际需求调整内存配置
- 考虑设置适当的超时时间

## 注意事项
- 大文件处理可能需要更多资源
- 建议配置错误通知
- 注意存储空间使用情况

## 支持的图片格式
### 输入格式
- HEIC
- PNG
- JPEG
- WEBP
- GIF (静态)

### 输出格式
- JPEG
- PNG
- WEBP

## 性能考虑
- 建议图片大小不超过 10MB
- 批量处理时注意内存使用
- 考虑设置合理的超时时间
