import {
	DeleteObjectCommand,
	type DeleteObjectCommandInput,
	GetObjectCommand,
	PutObjectCommand,
	type PutObjectCommandInput,
	S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorageService {
	private readonly client: S3Client
	private readonly bucket: string

	public constructor(private readonly configService: ConfigService) {
		const tenantId = this.configService.getOrThrow<string>('S3_TENANT_ID')
		const keyId = this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID')

		this.client = new S3Client({
			endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
			region: this.configService.getOrThrow<string>('S3_REGION'),
			credentials: {
				accessKeyId: `${tenantId}:${keyId}`,
				secretAccessKey: this.configService.getOrThrow<string>(
					'S3_SECRET_ACCESS_KEY'
				)
			},
			forcePathStyle: true
		})

		this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
	}

	public async upload(buffer: Buffer, key: string, mimetype: string) {
		const command: PutObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key),
			Body: buffer,
			ContentType: mimetype
		}

		try {
			await this.client.send(new PutObjectCommand(command))
			const signedUrl = await this.getSignedUrl(key)
			return signedUrl
		} catch (error) {
			console.error('S3 Upload Error:', error)
			throw error
		}
	}

	public async remove(key: string) {
		const command: DeleteObjectCommandInput = {
			Bucket: this.bucket,
			Key: String(key)
		}

		try {
			await this.client.send(new DeleteObjectCommand(command))
		} catch (error) {
			throw error
		}
	}
	public async getSignedUrl(key: string): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: key
		})
		return getSignedUrl(this.client, command, { expiresIn: 604800 }) // 7 дней
	}
}
