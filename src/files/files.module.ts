import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [FilesService],
  exports: [FilesService],
  imports: [FirebaseModule],
  controllers: [FilesController],
})
export class FilesModule {}
