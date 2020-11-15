const [
    jsQR,
    QRCode,
] = await Promise.all([
    'https://cdn.jsdelivr.net/gh/cozmo/jsQR@29aa086/dist/jsQR.js',
    'https://cdn.jsdelivr.net/gh/papnkukn/qrcode-svg@1.1/dist/qrcode.min.js',
].map(url => requireAsync.call({ skipTransform: true }, url)))

const linkMap = new WeakMap;

export {
    jsQR,
    QRCode,
}

export function removeQRLink(qr){
    if(linkMap.has(qr)){
        URL.revokeObjectURL(linkMap.get(qr));
        linkMap.delete(qr)
    }
}

export function createQRLink(qr){
    if(!linkMap.has(qr)) linkMap.set(qr, URL.createObjectURL(new Blob([ qr.svg() ], { type: 'image/svg+xml' })));
    return linkMap.get(qr)
}
