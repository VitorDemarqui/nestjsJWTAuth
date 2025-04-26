import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//torna o modulo global, ou seja, pode ser utilizado em qualquer lugar da aplicação
@Global()
@Module({
  providers: [PrismaService],
  //exporta o PrismaService para que possa ser utilizado em outros modulos
  exports: [PrismaService],
})
export class PrismaModule {}
