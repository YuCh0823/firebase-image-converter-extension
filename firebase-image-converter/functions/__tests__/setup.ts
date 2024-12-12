// @ts-nocheck
import * as admin from 'firebase-admin';

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  storage: jest.fn(() => ({
    bucket: jest.fn(() => ({
      file: jest.fn(),
      upload: jest.fn(),
    })),
  })),
}));

// Mock Firebase Functions
jest.mock('firebase-functions', () => ({
  config: jest.fn(() => ({
    imageconverter: {
      location: 'us-central1',
      img_bucket: 'test-bucket',
      target_format: 'jpg',
      quality: 80,
      generate_thumbnail: true,
      thumbnail_size: 200,
      preserve_original: true,
      allowed_formats: 'jpg,jpeg,png,webp,heic',
    },
  })),
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
  storage: {
    object: jest.fn(),
  },
  handler: {
    storage: {
      object: {
        onChange: jest.fn(),
      },
    },
  },
}));
