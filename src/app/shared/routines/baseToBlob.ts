export function base64ToBlob(base64, type?: string) {
  const byteString = window.atob(base64);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([int8Array], { type: type ? type : 'charset=utf-8' });
  return blob;
}
