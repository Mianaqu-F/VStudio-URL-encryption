// BASE URL - ganti sesuai kebutuhan (demo pakai example.com)
const BASE_URL = "https://example.com/profile";

const el = id => document.getElementById(id);

function showResult(text) {
  el('result').value = text;
}

// Generate URL biasa: ?id=12345&name=Budi
function generatePlain() {
  const id = el('input-id').value.trim();
  const name = el('input-name').value.trim();
  const url = `${BASE_URL}?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`;
  showResult(url);
}

// Base64 (obfuscation saja)
function generateBase64() {
  const id = el('input-id').value.trim();
  // btoa hanya untuk teks ASCII (id angka aman). Untuk teks unicode perlu handling tambahan.
  const uid = btoa(id);
  const url = `${BASE_URL}?uid=${encodeURIComponent(uid)}`;
  showResult(url);
}

// AES encrypt (menggabungkan id+name menjadi JSON lalu enkripsi)
function generateAES() {
  const id = el('input-id').value.trim();
  const name = el('input-name').value.trim();
  const key = el('input-key').value || "secret123!";

  // data yang kita enkripsi: kita pakai JSON agar bisa membawa banyak field
  const data = JSON.stringify({ id, name });

  // CryptoJS.AES.encrypt menghasilkan string base64 yang aman untuk di URL jika di-encodeURIComponent
  const ciphertext = CryptoJS.AES.encrypt(data, key).toString();
  const url = `${BASE_URL}?uid=${encodeURIComponent(ciphertext)}`;
  showResult(url);
}

// Decode AES demo (client-side)
function decodeAES() {
  const uidRaw = el('input-uid').value.trim();
  const key = el('input-key').value || "secret123!";
  if (!uidRaw) { el('decode-output').textContent = 'Masukkan uid dulu.'; return; }

  try {
    // jika uid di-URL encoded, pastikan decode dulu
    const uid = decodeURIComponent(uidRaw);
    const bytes = CryptoJS.AES.decrypt(uid, key);
    const original = bytes.toString(CryptoJS.enc.Utf8);
    if (!original) throw new Error('Gagal decode (mungkin kunci salah).');

    // coba parse JSON
    let parsed = original;
    try { parsed = JSON.parse(original); } catch(e) { /* bukan JSON */ }

    el('decode-output').textContent = `Hasil decrypt: ${typeof parsed === 'object' ? JSON.stringify(parsed, null, 2) : parsed}`;
  } catch (e) {
    el('decode-output').textContent = 'Error saat men-decrypt: ' + e.message;
  }
}

// Copy result to clipboard
async function copyResult() {
  const text = el('result').value;
  if (!text) return;
  await navigator.clipboard.writeText(text);
  alert('Disalin ke clipboard!');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  el('btn-plain').addEventListener('click', generatePlain);
  el('btn-base64').addEventListener('click', generateBase64);
  el('btn-aes').addEventListener('click', generateAES);
  el('btn-decode').addEventListener('click', decodeAES);
  el('btn-copy').addEventListener('click', copyResult);
});
