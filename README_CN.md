# Firebase 扩展开发项目

这个仓库包含了一系列为学习和演示目的开发的 Firebase 扩展。每个扩展都旨在展示 Firebase 扩展开发的不同方面和最佳实践。

## 当前扩展

### 1. 图片转换扩展 (`firebase-image-converter`)

一个功能强大的图片转换扩展，可以自动处理上传到 Firebase Storage 的图片。

#### 功能特性
- ✅ 多格式图片转换（JPEG、PNG、WebP、HEIC）
- ✅ 自动生成缩略图
- ✅ 可配置的输出选项
- ✅ 全面的错误处理和日志记录
- ✅ 高测试覆盖率（>95%）

#### 开发进度
- [x] 核心功能
  - [x] 图片格式转换
  - [x] 缩略图生成
  - [x] 配置管理
  - [x] 错误处理
  - [x] 日志系统
- [x] 测试
  - [x] 单元测试
  - [x] 配置测试
  - [x] 文件工具测试
  - [x] 日志测试
  - [ ] 集成测试
- [ ] 高级功能
  - [ ] 水印支持
  - [ ] 性能优化
  - [ ] 批量处理
  - [ ] 图片元数据保留
- [ ] 文档
  - [ ] API 文档
  - [ ] 配置指南
  - [ ] 部署指南
  - [ ] 故障排除指南

#### 技术栈
- Firebase 扩展
- TypeScript
- Sharp（图片处理）
- Jest（测试）

#### 代码质量指标
- 语句覆盖率：98.03%
- 分支覆盖率：83.11%
- 函数覆盖率：100%
- 行覆盖率：98.01%

## 项目结构
```
hello-firebase/
├── firebase-image-converter/
│   ├── functions/
│   │   ├── src/
│   │   │   ├── config/     # 配置相关代码
│   │   │   ├── converters/ # 转换器实现
│   │   │   └── utils/      # 工具类
│   │   └── __tests__/      # 测试文件
│   ├── extension.yaml      # 扩展配置文件
│   └── README.md          # 扩展说明文档
└── README.md              # 项目说明文档
```

## 快速开始

### 环境要求
- Node.js（v16 或更高版本）
- Firebase CLI
- Firebase 项目

### 安装步骤
1. 克隆仓库：
```bash
git clone <仓库地址>
cd hello-firebase
```

2. 安装依赖：
```bash
cd firebase-image-converter/functions
npm install
```

3. 运行测试：
```bash
npm test
```

## 参与贡献
请阅读 [CONTRIBUTING.md](firebase-image-converter/CONTRIBUTING.md) 了解我们的行为准则以及提交拉取请求的流程。

## 下一步计划
1. 实现水印功能
2. 添加性能优化
3. 创建完整的文档
4. 添加集成测试

## 开发进度
- [x] 基础框架搭建
- [x] 核心功能实现
- [x] 单元测试编写
- [ ] 高级功能开发
- [ ] 文档完善
- [ ] 性能优化

## 常见问题
1. **如何配置图片转换参数？**
   - 在 `extension.yaml` 文件中设置相关参数
   - 支持配置输出格式、质量、缩略图大小等

2. **支持哪些图片格式？**
   - 输入格式：JPEG、PNG、WebP、HEIC
   - 输出格式：JPEG、PNG、WebP

3. **如何处理大文件？**
   - 使用流式处理
   - 自动清理临时文件
   - 支持配置最大文件大小

## 许可证
本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式
如有问题或建议，请通过以下方式联系我们：
- 提交 Issue
- 发起 Pull Request
- 发送邮件至 [your-email@example.com]

## 致谢
感谢所有为本项目做出贡献的开发者！
