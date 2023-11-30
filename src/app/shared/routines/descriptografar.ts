import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

export default function descriptografar(texto: string): string {
  try {
    if (texto && texto.trim() !== '')
      return CryptoJS.AES.decrypt(texto, environment.encryptSecretKey).toString(
        CryptoJS.enc.Utf8
      );
    else return '';
  } catch (err) {
    return '';
  }
}
