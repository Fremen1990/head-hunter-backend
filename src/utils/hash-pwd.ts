import * as crypto from 'crypto';

const hmacKey =
   'lk;kgfl;dsgojwer ojeoprjpoewj roewjo23242@#$#@$Edffewdfdspojafdjohdsfuoihf#24noidsfhy8#$wkfnsd kasndf  naskd n}S}AD}sa';

export const hashPwd = (p: string): string => {
   const hmac = crypto.createHmac('sha512', hmacKey);
   hmac.update(p);
   return hmac.digest('hex');
};
