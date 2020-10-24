import * as account1 from './demo_data.js'
import age from './age.js'
import AsyncClass from './asyncClass.js'

class Account extends AsyncClass{
	async asyncConstructor(id){
		this.avatar = account1.avatar;
		this.firstName = account1.firstName;
		this.lastName = account1.lastName;
		this.birthday = account1.birthDay;
		this.nickname = account1.nickname;
		this.citizen = account1.citizen;
		if(/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(account1.birthDay)) this.age = age(...account1.birthDay.split('.'))
	}
}

export default async id => {
	return await new Account(id)
}
