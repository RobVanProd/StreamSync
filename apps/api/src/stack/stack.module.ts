import { Module } from '@nestjs/common';
import { StackController } from './stack.controller';
import { StackService } from './stack.service';
import { TmdbService } from './tmdb.service';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
    imports: [RoomsModule],
    controllers: [StackController],
    providers: [StackService, TmdbService],
    exports: [TmdbService],
})
export class StackModule { }
