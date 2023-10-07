import { createTransport } from 'nodemailer';
import { IEmailOptions } from '../common/interfaces';

const transport = createTransport({
  service: 'Gmail',
  auth: {
    user: 'khaleda.02f@gmail.com',
    pass: 'kizzzwntxcfrniaz',
  },
});

export const sendEmail = async (options: IEmailOptions) => {
  try {
    await transport.sendMail(options);
  } catch (error) {
    console.error('error sending email [in util send email fun]', error);
  }
};

export const OTPCodeGenerator = () => {
  return Math.floor(Math.random() * 9000 + 1000);
};
