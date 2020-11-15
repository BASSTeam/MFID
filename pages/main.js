import { root, images } from '../controllers/paths.js'
import getAccountInfo from '../controllers/account.js'
import { QRCode, createQRLink, jsQR } from '../controllers/qr.js'
import { getCameraVideo } from '@mfelements/user-media'

const defaultPage = await fetch(root + '/getIndex').then(v => v.json());

function processQRStream(){
	let cancel, done;
	const p = new Promise(async (resolve, reject) => {
		const { stream } = await getCameraVideo({
			type: 'imageData',
			frameRate: 30,
			videoPosition: 'fullscreen'
		});
		const streamReader = stream.getReader();
		cancel = () => {
			if(!done){
				streamReader.cancel();
				reject('canceled')
			}
		};
		streamReader.read().then(function process({ value: { data, width, height } }){
			if(done){
				done = false;
				cancel()
			}
			const code = jsQR(data, width, height);
			if(code){
				done = true;
				streamReader.cancel();
				resolve(code);
			}
			return streamReader.read().then(process)
		});
	});
	return Object.assign(p, {
		cancel(){
			if(typeof cancel === 'function') cancel();
			else done = true
		}
	})
}

registerAction('scanQR', async () => {
	const stream = processQRStream();
	return {
		type: 'page',
		children: [
			'Отсканировано: ' + await stream
		]
	}
});

export default async () => {
	const account = await getAccountInfo('demoId');
	return {
		type: 'page',
		title: defaultPage.data.title,
		themeColor: defaultPage.data.themeColor,
		icon: defaultPage.data.icon,
		children: [
			{
				type: 'block',
				children: [
					{
						type: 'button',
						text: 'Отсканировать QR',
						onClick: {
							action: 'scanQR',
							args: [],
						},
					},
				],
			},
			/*
			{
				type: 'image',
				src: images + '/logo-black.svg',
				invertable: true,
			},
			*/
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
							src: createQRLink(new QRCode('test me')),
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
