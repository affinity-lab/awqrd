import {type Transporter} from 'nodemailer';

export type CourierEmail = {
	fromName: string,
	fromAddress: string,
	toName: string,
	toAddress: string,
	subject: string,
	text: string,
	html: string
}

export class CourierService {

	constructor(private transporter: Transporter, private errorFn: (error: Error) => void = (e) => console.log(e)) {
	}

	public async sendEmail(email: CourierEmail) {
		try {
			await this.transporter.sendMail({
				from: {name: email.fromName, address: email.fromAddress},
				to: {name: email.toName, address: email.toAddress},
				subject: email.subject,
				text: email.text,
				html: email.html
			})
		} catch (e) {
			this.errorFn(e as Error);
		}
	}
}