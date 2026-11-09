import {pbkdf2Sync,randomBytes} from 'node:crypto';
const pw=process.argv[2];
if(!pw||pw.length<12){console.error('Pakai: node scripts/setup-secrets.mjs "<password min 12 karakter>"');process.exit(1)}
const salt=randomBytes(16),it=100000;
console.log('ADMIN_PATH=/control/'+randomBytes(9).toString('base64url'));
console.log('ADMIN_PASSWORD_HASH=pbkdf2:'+it+':'+salt.toString('base64')+':'+pbkdf2Sync(pw,salt,it,32,'sha256').toString('base64'));
