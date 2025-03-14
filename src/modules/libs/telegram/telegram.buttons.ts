import { Markup } from 'telegraf'

export const BUTTONS = {
	authSuccess: Markup.inlineKeyboard([
		[
			Markup.button.callback('📜 Мои подписки', 'follows'),
			Markup.button.callback('👤 Просмотреть профиль', 'me')
		],
		[Markup.button.url('🌐 На сайт', 'https://vs-dev-streamerx.ru')]
	]),
	profile: Markup.inlineKeyboard([
		Markup.button.url(
			'⚙️ Настройки аккаунта',
			'https://vs-dev-streamerx.ru/dashboard/settings'
		)
	])
}
