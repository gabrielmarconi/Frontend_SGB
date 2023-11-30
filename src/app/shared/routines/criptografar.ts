import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

export default function criptografar(texto: string): string {
  try {
    if (texto && texto.trim() !== '')
      return CryptoJS.AES.encrypt(
        texto,
        environment.encryptSecretKey
      ).toString();
    else return '';
  } catch (err) {
    return '';
  }
}
