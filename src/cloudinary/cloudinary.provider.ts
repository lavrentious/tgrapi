import { v2 } from 'cloudinary';

export const CLOUDINARY = 'Cloudinary';

export type CloudinaryDeleteResult = {
  result: 'ok' | 'not found' | string;
};

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () =>
    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    }),
};
