# Firebase Extensions Development Project

This repository contains a collection of Firebase Extensions developed for learning and demonstration purposes. Each extension is designed to showcase different aspects of Firebase Extension development and best practices.

## Current Extensions

### 1. Image Converter Extension (`firebase-image-converter`)

A powerful image conversion extension that automatically processes images uploaded to Firebase Storage.

#### Features
- ✅ Multi-format image conversion (JPEG, PNG, WebP, HEIC)
- ✅ Automatic thumbnail generation
- ✅ Configurable output options
- ✅ Comprehensive error handling and logging
- ✅ High test coverage (>95%)

#### Development Progress
- [x] Core functionality
  - [x] Image format conversion
  - [x] Thumbnail generation
  - [x] Configuration management
  - [x] Error handling
  - [x] Logging system
- [x] Testing
  - [x] Unit tests
  - [x] Configuration tests
  - [x] File utility tests
  - [x] Logger tests
  - [ ] Integration tests
- [ ] Advanced Features
  - [ ] Watermark support
  - [ ] Performance optimization
  - [ ] Batch processing
  - [ ] Image metadata preservation
- [ ] Documentation
  - [ ] API documentation
  - [ ] Configuration guide
  - [ ] Deployment guide
  - [ ] Troubleshooting guide

#### Technical Stack
- Firebase Extensions
- TypeScript
- Sharp (Image processing)
- Jest (Testing)

#### Code Quality Metrics
- Statement Coverage: 98.03%
- Branch Coverage: 83.11%
- Function Coverage: 100%
- Line Coverage: 98.01%

## Project Structure
```
hello-firebase/
├── firebase-image-converter/
│   ├── functions/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── converters/
│   │   │   └── utils/
│   │   └── __tests__/
│   ├── extension.yaml
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- Firebase CLI
- Firebase Project

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd hello-firebase
```

2. Install dependencies:
```bash
cd firebase-image-converter/functions
npm install
```

3. Run tests:
```bash
npm test
```

## Contributing
Please read [CONTRIBUTING.md](firebase-image-converter/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Next Steps
1. Implement watermark functionality
2. Add performance optimizations
3. Create comprehensive documentation
4. Add integration tests

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
