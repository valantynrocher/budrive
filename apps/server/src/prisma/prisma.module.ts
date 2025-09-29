import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // rend Prisma accessible partout sans réimporter
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
