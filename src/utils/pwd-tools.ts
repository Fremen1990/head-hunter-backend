import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16;
const SECRET = process.env.PASS_SECRET;
// TODO to be delted in final refactor
// const SECRET = process.env.SECRET_KEY!;
// const SECRET = 'dontbescaredhomie';
const KEY = crypto
   .createHash('sha256')
   .update(String(SECRET))
   .digest('base64')
   .substr(0, 32);

// TODO to be delted in final refactor
// const HMAC_KEY =
//    'lk;kgfl;dsgojwer ojeoprjpoewj roewjo23242@#$#@$Edffewdfdspojafdjohdsfuoihf#24noidsfhy8#$wkfnsd kasndf  naskd n}S}AD}sa';

const HMAC_KEY = process.env.PASS_HMAC_KEY;

export const hashPwd = (p: string): string => {
   const hmac = crypto.createHmac('sha512', HMAC_KEY);
   hmac.update(p);
   return hmac.digest('hex');
};

export const encrypt = (data: string) => {
   const iv = crypto.randomBytes(IV_LENGTH);
   const cipher = crypto.createCipheriv(ALGORITHM, new Buffer(KEY), iv);
   return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(
      ENCODING,
   );
};

export const decrypt = (data: string) => {
   const binaryData = new Buffer(data, ENCODING);
   const iv = binaryData.slice(-IV_LENGTH);
   const encryptedData = binaryData.slice(0, binaryData.length - IV_LENGTH);
   const decipher = crypto.createDecipheriv(ALGORITHM, new Buffer(KEY), iv);

   return Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
   ]).toString();
};
