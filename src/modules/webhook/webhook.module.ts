import { Module, RequestMethod } from '@nestjs/common'
import type { MiddlewareConsumer } from '@nestjs/common/interfaces'

import { RawBodyMiddleware } from '@/src/shared/middlewares/raw-body.middleware'

// import { TelegramService } from '../libs/telegram/telegram.service'
import { NotificationService } from '../notification/notification.service'

import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'

@Module({
	controllers: [WebhookController],
	providers: [
		WebhookService,
		NotificationService
		// TelegramService
	]
})
export class WebhookModule {
	public configure(cosumer: MiddlewareConsumer) {
		cosumer
			.apply(RawBodyMiddleware)
			.forRoutes({ path: 'webhook/livekit', method: RequestMethod.POST })
	}
}
