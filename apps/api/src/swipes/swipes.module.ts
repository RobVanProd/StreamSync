import { Module } from '@nestjs/common';
import { SwipesController } from './swipes.controller';
import { SwipesService } from './swipes.service';
import { RoomsModule } from '../rooms/rooms.module';
import { StackModule } from '../stack/stack.module';

@Module({
    imports: [RoomsModule, StackModule],
    controllers: [SwipesController],
    providers: [SwipesService],
})
export class SwipesModule { }
