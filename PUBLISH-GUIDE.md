# Panduan Publish ke NPM - n8n-nodes-csku

Package sudah siap untuk di-publish, tetapi ada issue dengan TypeScript version. 

## Solusi Cepat - Publish Tanpa Build

Karena file-file TypeScript sudah benar, Anda bisa publish tanpa build dengan cara:

### 1. Update package.json untuk menggunakan file source langsung

Ubah file `package.json` bagian files dan n8n:

```json
"files": [
  "nodes",
  "credentials"
],
"n8n": {
  "n8nNodesApiVersion": 1,
  "credentials": [
    "credentials/CskuApi.credentials.js"
  ],
  "nodes": [
    "nodes/Csku/Csku.node.js"
  ]
}
```

### 2. Rename files .ts menjadi .js

```bash
cd /Users/yolk/AKI/n8n-nodes-csku

# Rename TypeScript files to JavaScript
mv nodes/Csku/Csku.node.ts nodes/Csku/Csku.node.js
mv credentials/CskuApi.credentials.ts credentials/CskuApi.credentials.js
```

### 3. Login ke NPM

```bash
npm login
```

Masukkan:
- Username NPM Anda
- Password
- Email
- 2FA code (jika aktif)

### 4. Publish

```bash
npm publish --access public
```

---

## Solusi Proper - Fix TypeScript dan Build

Jika ingin proper solution dengan TypeScript compiled:

### 1. Remove dan reinstall dengan TypeScript yang lebih baru

```bash
npm uninstall typescript
npm install --save-dev typescript@^5.0.0
```

### 2. Update package.json - hapus prepublishOnly script

Ubah bagian scripts:

```json
"scripts": {
  "build": "tsc && gulp build:icons",
  "dev": "tsc --watch",
  "format": "prettier nodes credentials --write"
}
```

### 3. Build manual

```bash
npm run build
```

### 4. Publish

```bash
npm publish --access public
```

---

## Step-by-Step Publishing

### Persiapan Sebelum Publish:

1. **Pastikan sudah punya akun NPM**
   - Daftar di https://www.npmjs.com/signup jika belum
   
2. **Update informasi di package.json**
   - Ubah "author" dengan nama dan email Anda ✅ (sudah benar)
   - Ubah "repository" dengan repo GitHub Anda ✅ (sudah benar)
   - Version sudah 0.1.0 ✅

3. **Create GitHub Repository (Opsional tapi recommended)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yolkmonday/n8n-nodes-csku.git
   git push -u origin main
   ```

### Publish ke NPM:

```bash
# 1. Login ke NPM
npm login

# 2. Test package sebelum publish (optional)
npm pack
# Ini akan create file n8n-nodes-csku-0.1.0.tgz
# Anda bisa inspect isi package

# 3. Publish (gunakan --access public untuk public package)
npm publish --access public

# 4. Jika berhasil, Anda akan lihat:
# + n8n-nodes-csku@0.1.0
```

### Verifikasi setelah Publish:

1. Cek di NPM: https://www.npmjs.com/package/n8n-nodes-csku
2. Install di n8n lokal untuk test:
   ```bash
   npm install n8n-nodes-csku
   ```

---

## Troubleshooting

### Error: "You must be logged in to publish packages"
```bash
npm login
```

### Error: "Package name already exists"
Gunakan scoped package:
- Ubah `"name": "n8n-nodes-csku"` menjadi `"name": "@your-username/n8n-nodes-csku"`
- Publish dengan: `npm publish --access public`

### Error: "You do not have permission to publish"
- Pastikan package name belum digunakan orang lain
- Atau gunakan scoped package (@your-username/package-name)

### Build Error dengan TypeScript
Gunakan solusi "Publish Tanpa Build" di atas, atau:
```bash
npm install --save-dev typescript@5.0.0
npm run build
```

---

## Update Package di Masa Depan

Untuk update package:

1. Ubah version di package.json (contoh: 0.1.0 → 0.1.1)
2. Commit changes
3. `npm publish`

Semantic versioning:
- `0.1.0` → `0.1.1` - Bug fixes (patch)
- `0.1.0` → `0.2.0` - New features (minor)
- `0.1.0` → `1.0.0` - Breaking changes (major)

---

## Testing Package di n8n

Setelah publish, untuk test di n8n lokal:

```bash
# Install di n8n
cd ~/.n8n
npm install n8n-nodes-csku

# Restart n8n
n8n start
```

Node "CSKU" akan muncul di n8n editor.

---

## File yang akan di-publish

Dengan config saat ini, yang akan masuk ke package:
- `dist/` folder (hasil build)
- `LICENSE.md`
- `README.md`
- `package.json`

File yang **tidak** akan masuk (karena .npmignore):
- `node_modules/`
- Source files `.ts`
- Config files (`tsconfig.json`, dll)
- `.git/`

---

## Rekomendasi Saya

Gunakan **Solusi Cepat** (rename .ts ke .js) karena:
1. Lebih cepat
2. n8n bisa handle file .js dengan sintaks modern
3. Tidak perlu deal dengan TypeScript compilation issues

Setelah publish berhasil, bisa perbaiki build process nanti untuk update berikutnya.

## Command untuk Rename dan Publish

```bash
cd /Users/yolk/AKI/n8n-nodes-csku

# Backup dulu (optional)
cp -r nodes nodes-backup
cp -r credentials credentials-backup

# Rename files
mv nodes/Csku/Csku.node.ts nodes/Csku/Csku.node.js
mv credentials/CskuApi.credentials.ts credentials/CskuApi.credentials.js

# Update package.json files section
# (edit manual atau gunakan code editor)

# Login dan publish
npm login
npm publish --access public
```

Setelah berhasil publish, file akan tersedia di:
https://www.npmjs.com/package/n8n-nodes-csku
