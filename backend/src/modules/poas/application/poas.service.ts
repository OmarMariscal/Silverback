import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { PoaActualDto } from './DTOS/response/poa-actual.dto';

@Injectable()
export class PoasService {
    constructor(private prisma: PrismaService){}

    obtenerPoa(poaActual: PoaActualDto){
        return this.prisma.poa.findFirst();
    }
}
