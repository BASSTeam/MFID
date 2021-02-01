import defaultPage from '../controllers/indexPage.js'
import getAccountInfo from '../controllers/account.js'
import { QRCode, createQRLink } from '../controllers/qr.js'
import { getCameraVideo } from '@mfelements/user-media'

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
						text: 'scan_qr',
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
						[{
							type: 'printf',
							text: 'front_side',
							args: [
								account.firstName,
								account.lastName,
								account.nickname,
								account.birthday,
								{
									type: 'printf',
									subType: 'number_localization',
									num: account.age,
									key: 'years_old'
								},
								{
									type: 'printf',
									text: account.citizen ? 'citizen' : account.resident ? 'resident' : 'watcher'
								},
							]
						}],
						{
							type: 'button',
							text: 'show_email',
						},
					],
					[
						{
							type: 'image',
							src: createQRLink(new QRCode('In progress. There is no real reason to show you a real QR now \'cause there is no software ready to read it')),
							ratio: '1:1',
							width: '100%',
							invertable: true,
						},
						{
							type: 'printf',
							text: 'scan_this_qr'
						},
						{
							type: 'dialog',
							text: 'not_implemented',
							btnText: 'check_yourself',
							buttons: [
								{
									text: 'ok',
								},
							],
						},
					],
				],
			},
		],
	}
}
