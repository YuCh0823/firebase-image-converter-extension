# 贡献指南

感谢你对 Firebase Image Converter 的关注！

## 开发环境设置

### 1. 前置要求
- Node.js (v14 或更高版本)
- Firebase CLI
- Git

### 2. 本地开发环境设置
```bash
# 克隆仓库
git clone [repository-url]
cd firebase-image-converter

# 安装依赖
npm install

# 设置 Firebase 环境
firebase login
firebase init
```

## 代码规范

### TypeScript 规范
- 使用 TypeScript 编写所有代码
- 遵循项目的 tsconfig.json 配置
- 所有函数都要有类型声明
- 使用接口定义复杂类型

### 代码风格
- 使用 ESLint 进行代码检查
- 遵循项目的 .eslintrc 配置
- 使用 Prettier 进行代码格式化
- 保持代码简洁清晰

### 测试要求
- 为所有新功能编写单元测试
- 确保测试覆盖率达到要求
- 运行所有测试并确保通过
- 包含集成测试（如适用）

## 提交规范

### Git 提交消息
使用语义化的提交消息：
- feat: 新功能
- fix: 错误修复
- docs: 文档更新
- style: 代码格式修改
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

### 分支管理
- main: 主分支，保持稳定
- develop: 开发分支
- feature/*: 新功能分支
- bugfix/*: 错误修复分支

## 测试指南

### 单元测试
```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- [test-name]

# 查看测试覆盖率
npm run test:coverage
```

### 集成测试
- 在本地环境测试
- 在测试环境部署测试
- 性能测试
- 负载测试

## 发布流程

### 1. 准备发布
- 更新版本号
- 更新 CHANGELOG.md
- 更新文档
- 确保所有测试通过

### 2. 创建发布
- 创建发布分支
- 更新发布说明
- 标记版本
- 提交审核

### 3. 发布后
- 监控性能
- 收集反馈
- 处理问题报告
- 更新文档（如需要）

## 其他注意事项
- 保持代码文档更新
- 遵循安全最佳实践
- 考虑向后兼容性
- 优化性能

## 联系方式
- 技术讨论：[GitHub Discussions]
- 问题报告：[GitHub Issues]
- 邮件联系：[dev@example.com]
