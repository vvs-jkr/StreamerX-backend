import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './inputs/create-user.input';
import { hash, verify } from 'argon2'


@Injectable()
export class AccountService {
	public constructor(private readonly prismaServise: PrismaService) {}

	public async findAll(){
		const users = await this.prismaServise.user.findMany();
		return users
	}

	public async create(input: CreateUserInput) {
		const {username, email, password} = input

		const isUsernameExist = await this.prismaServise.user.findUnique({
			where: {
				username
			}
		})

		if(isUsernameExist){
			throw new ConflictException('Username already exist')
		}

		const isEmailExist = await this.prismaServise.user.findUnique({
			where: {
				email
			}
		})

		if(isEmailExist){
			throw new ConflictException('This email already exist')
		}

		await this.prismaServise.user.create({
			data:{
				username,
				email,
				password: await hash(password),
				displayName: username
			}
		})

		return true
	}
}
