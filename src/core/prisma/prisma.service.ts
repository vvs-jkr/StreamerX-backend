import { Injectable, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/generated';

@Injectable()
export class PrismaService 
extends PrismaClient 
implements OnModuleInit, OnModuleDestroy 
{
    public async onModuleInit(): Promise<void> {
        await this.$connect();
    }

    public async onModuleDestroy(): Promise<void> {
        await this.$disconnect();
    }
}
