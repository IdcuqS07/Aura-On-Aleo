# 🚀 Aleo Deployment - Manual Steps Required

## ✅ Build Status: SUCCESS

Program `zkbadge.aleo` telah berhasil di-compile!

## ⚠️ Deployment Membutuhkan Terminal Interaktif

Leo CLI membutuhkan konfirmasi manual yang tidak bisa dilakukan via automation.

## 📋 Langkah Deploy Manual

### 1. Buka Terminal Baru

```bash
cd "/Users/idcuq/Documents/Aleo Aura V.1.1 2/aleo-programs/zkbadge"
```

### 2. Check Balance (Optional)

Pastikan punya testnet credits:
```bash
leo account
```

Jika belum punya credits, request di: https://faucet.aleo.org/
- Address: `aleo1ecrqqyvaszpehqc967g5aau4uqt2dg3y5ardm0y5wf4hxjajzsyqm5cxke`

### 3. Deploy Program

```bash
leo deploy --network testnet --broadcast
```

Akan muncul prompt:
- Konfirmasi deployment: ketik `y` + Enter
- Tunggu proses deployment (1-2 menit)

### 4. Verify Deployment

Setelah berhasil, cek di Aleo Explorer:
```
https://explorer.aleo.org/program/zkbadge.aleo
```

## 📊 Deployment Info

- **Program**: zkbadge.aleo
- **Network**: Aleo Testnet
- **Account**: aleo1ecrqqyvaszpehqc967g5aau4uqt2dg3y5ardm0y5wf4hxjajzsyqm5cxke
- **Build Status**: ✅ Compiled (54 statements)
- **Estimated Cost**: ~5-10 credits

## 🔧 Troubleshooting

**Error: Insufficient balance**
→ Request credits dari faucet

**Error: Program already exists**
→ Program name sudah dipakai, ganti di `program.json`

**Error: Network timeout**
→ Coba lagi atau tunggu beberapa menit

## 📝 Next Steps After Deployment

1. Save program address ke backend config
2. Update frontend dengan program address
3. Test functions via Leo CLI
4. Deploy `credit_passport.aleo` program

---

**Status**: ✅ Ready to Deploy (Manual Step Required)
**Date**: January 2025
