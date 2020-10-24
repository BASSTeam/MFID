import { root, images } from '../controllers/paths.js'
import getAccountInfo from '../controllers/account.js'

const defaultPage = await fetch(root + '/getIndex').then(v => v.json());

export default async () => {
	console.log('called main page');
	const account = await getAccountInfo('demoId');
	console.log('got account info');
	return {
		type: 'page',
		title: defaultPage.title,
		themeColor: defaultPage.themeColor,
		icon: defaultPage.icon,
		children: [
			{
				type: 'image',
				src: images + '/logo-black.svg',
				invertable: true,
			},
			{
				type: 'card',
				ratio: '5398:8572:1300',
				height: '550px',
				color: defaultPage.themeColor,
				children: [
					[
						{
							type: 'image',
							src: account.avatar,
							invertable: false,
							ratio: '1:1',
							width: '60%',
						},
						[ [
							'\\\n\\\n',
							`**${account.firstName} ${account.lastName}**`,
							`aka ${account.nickname}`,
							'**Дата рождения:**',
							`${account.birthday} (${account.age} года)`,
							`**${account.citizen ? 'Гражданин' : account.resident ? 'Резидент' : 'Наблюдатель'}**`,
						].join('\\\n') ],
						{
							type: 'button',
							text: 'Показать e-mail',
						},
					],
					[
						{
							type: 'image',
							src: account.avatar,
							ratio: '1:1',
							width: '100%',
						},
						[ "\\\n_Отсканируйте этот QR-код в MFID, чтобы проверить валидность документа_" ],
						{
							type: 'dialog',
							text: '##Тут окно',
							btnText: 'Проверить вручную',
							buttons: [
								{
									text: 'OK',
								},
							],
						},
					],
				],
			},
		],
	}
}
