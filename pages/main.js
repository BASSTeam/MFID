import { root } from '../controllers/paths.js'
import getAccountInfo from '../controllers/account.js'
import { QRCode, createQRLink } from '../controllers/qr.js'
import { getCameraVideo } from '@mfelements/user-media'

const defaultPage = await fetch(root + '/getIndex').then(v => v.json());

async function processQRStream(){
	if(!(await BarcodeDetector.getSupportedFormats()).includes('qr_code'))
		throw new Error('QR code scanning not supported');

	const stream = getCameraVideo({
		type: 'imageData',
		videoPosition: 'fullscreen',
		frontCamera: false,
	});

	const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
	const p = new Promise(async r => {
		for await(const imageData of stream){
			let codes;
			try{
				codes = await barcodeDetector.detect(imageData);
			} catch(e){
				console.error(e);
			}
			console.log({codes});
			if(codes.length){
				stream.stop();
				return r(codes);
			} else {
				console.warn('Не удалось отсканировать код')
			}
		}
	});
	return Object.assign(p, {
		cancel(){
			stream.stop()
		}
	})
}

registerAction('scanQR', async () => {
	const stream = processQRStream();
	try{
		return {
			type: 'page',
			children: [
				'Отсканировано: ' + await stream
			]
		}
	} catch(e){
		return {
			type: 'page',
			children: [
				`${e.name}: ${e.message}`
			]
		}
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
