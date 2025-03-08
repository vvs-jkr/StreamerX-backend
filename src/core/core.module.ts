import { ApolloDriver } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { IS_DEV_ENV } from '@/shared/utils/is-dev-util';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { getGraphqlConfig } from './config/graphqlConfig';


@Module({
  imports: [
	ConfigModule.forRoot({
    ignoreEnvFile: !IS_DEV_ENV,
    isGlobal: true
  }),
  GraphQLModule.forRootAsync({
    driver: ApolloDriver,
	 imports:[ConfigModule],
    useFactory: getGraphqlConfig,
	 inject: [ConfigService],
  }),
  PrismaModule
],
})
export class CoreModule {}
