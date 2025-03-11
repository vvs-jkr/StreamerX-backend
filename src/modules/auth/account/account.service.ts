import { ConflictException, Injectable } from '@nestjs/common'
import { hash, verify } from 'argon2'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { VerificationService } from './../verification/verification.service'
import { CreateUserInput } from './inputs/create-user.input'

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly verificationService: VerificationService
	) {}

	public async me(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			}
			// include: {
			// 	socialLinks: true,
			// 	stream: true,
			// 	notificationSettings: true
			// }
		})

		return user
	}

	public async create(input: CreateUserInput) {
		const { username, email, password } = input

		const isUsernameExist = await this.prismaService.user.findUnique({
			where: {
				username
			}
		})

		if (isUsernameExist) {
			throw new ConflictException('Это имя пользователя уже занято')
		}

		const isEmailExist = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (isEmailExist) {
			throw new ConflictException('Эта почта уже занята')
		}

		const user = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName: username
				// stream: {
				// 	create: {
				// 		title: `Стрим ${username}`
				// 	}
				// },
				// notificationSettings: {
				// 	create: {}
				// }
			}
		})

		await this.verificationService.sendVerificationToken(user)

		return true
	}
}
