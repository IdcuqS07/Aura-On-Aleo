# Checklist GitHub OAuth App Settings

Buka: https://github.com/settings/developers

## ✅ Yang Harus Dicek:

### 1. Application name
- Bebas (contoh: "Aura Protocol")

### 2. Homepage URL
- `https://www.aurapass.xyz`

### 3. Authorization callback URL (PENTING!)
- **HARUS EXACTLY:** `https://www.aurapass.xyz/poh/callback`
- ❌ BUKAN: `http://` (harus `https://`)
- ❌ BUKAN: dengan trailing slash `/`
- ❌ BUKAN: `www.aurapass.xyz/poh/callback` (harus ada `https://`)

### 4. Application description (Optional)
- Bebas

### 5. Enable Device Flow (Optional)
- Tidak perlu dicentang

## 🔧 Jika Ada Masalah:

### Error: "redirect_uri_mismatch"
- Callback URL salah, harus exactly match

### Error: "Application suspended"
- App di-suspend GitHub, perlu buat app baru

### Error: "incorrect_client_credentials"
- Client Secret salah, perlu regenerate

## 🎯 Quick Test:

Setelah setting benar, test URL ini di browser:
```
https://github.com/login/oauth/authorize?client_id=Ov23liBkJpXGppFuyWWV&redirect_uri=https://www.aurapass.xyz/poh/callback&scope=read:user
```

Harusnya muncul halaman authorize GitHub, bukan error.

---

**Coba test URL di atas dulu, kalau error kasih tau error message-nya.**
