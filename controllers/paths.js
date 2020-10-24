/** @type {string[]} */
const parts = import.meta.url.split('/');
parts.pop();
parts.pop();

export const root = parts.join('/')

export const controllers = root + '/controllers'

export const assets = root + '/assets'

export const images = assets + '/images'

export const pages = root + '/pages'
