import nodemailer, {Transporter} from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";

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
	private transporter: Transporter;
	constructor(transporterOptions: SMTPTransport.Options, private errorFn: (error: Error) => void = (e) => console.log(e)) {
		this.transporter = nodemailer.createTransport(transporterOptions);
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