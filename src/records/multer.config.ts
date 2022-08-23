import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const EXT_WHITELST = ['image/png', 'image/jpeg', 'image/jpg'];
export const MAX_PHOTO_SIZE = 4194304;
export const MulterImageOptions: MulterOptions = {
  limits: { fileSize: MAX_PHOTO_SIZE },
  fileFilter: (_req, file, cb): void => {
    if (!EXT_WHITELST.includes(file.mimetype)) {
      cb(
        new BadRequestException('File must be a static image (jpeg/jpg/png)'),
        false,
      );
    } else {
      cb(null, true);
    }
  },
};
