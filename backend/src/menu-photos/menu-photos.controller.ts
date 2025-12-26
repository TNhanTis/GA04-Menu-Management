import {
  Controller,
  Post,
  Delete,
  Patch,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MenuPhotosService } from './menu-photos.service';
import { v4 as uuidv4 } from 'uuid';

// Multer configuration
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const randomName = uuidv4();
    const ext = extname(file.originalname);
    cb(null, `${randomName}${ext}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'Invalid file type. Only JPG, PNG, and WebP are allowed.',
      ),
      false,
    );
  }
};

@Controller('api/admin/menu/items/:itemId/photos')
export class MenuPhotosController {
  constructor(private readonly menuPhotosService: MenuPhotosService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadPhotos(
    @Param('itemId') itemId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const photos = await this.menuPhotosService.uploadPhotos(itemId, files);
    return {
      message: 'Photos uploaded successfully',
      photos,
    };
  }

  @Delete(':photoId')
  async deletePhoto(
    @Param('itemId') itemId: string,
    @Param('photoId') photoId: string,
  ) {
    await this.menuPhotosService.deletePhoto(itemId, photoId);
    return {
      message: 'Photo deleted successfully',
    };
  }

  @Patch(':photoId/primary')
  async setPrimaryPhoto(
    @Param('itemId') itemId: string,
    @Param('photoId') photoId: string,
  ) {
    const photo = await this.menuPhotosService.setPrimaryPhoto(itemId, photoId);
    return {
      message: 'Primary photo set successfully',
      photo,
    };
  }
}
