export default class {
	constructor(...args){
		return new Promise(async r => (await this.asyncConstructor(...args), r(this)))
	}
	asyncConstructor(){}
}
