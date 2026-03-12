# contributing to taskflow

makasih udah mau kontribusi ke **taskflow**! ini panduan singkatnya.

---

## cara kontribusi

### 1. fork & clone
```bash
git clone https://github.com/Sultan-skibidi/TaskFlow.git
cd TaskFlow
```

### 2. bikin branch
selalu bikin branch baru buat kerjain fitur:
```bash
git checkout -b feature-nama-fitur-kamu
```

**format penamaan branch:**
- `feature-*` buat fitur baru (contoh: `feature-dark-mode`)
- `fix-*` buat bug fix (contoh: `fix-task-counter`)
- `docs-*` buat perubahan dokumentasi (contoh: `docs-update-readme`)

### 3. kerjain perubahannya
- tulis kode yang rapi dan gampang dibaca
- ikutin code style yang udah ada
- tambahin komentar buat logika yang agak ribet
- test di beberapa browser

### 4. panduan commit
tulis commit message yang jelas:

**contoh yang bagus:**
- `Add search functionality with text highlighting`
- `Fix task counter not updating after delete`
- `Update README with installation instructions`

**contoh yang jelek:**
- `update`
- `fix stuff`
- `asdfgh`

### 5. push & bikin pr
```bash
git push -u origin feature-nama-fitur-kamu
```
terus bikin **pull request** di github:
- kasih judul yang jelas
- jelasin apa yang diubah dan kenapa
- tambahin screenshot kalo ada perubahan ui

---

## testing

sebelum submit pr, pastiin:

1. buka `index.html` di browser
2. test semua fitur yang udah ada masih jalan (add, complete, delete, filter, search)
3. test fitur baru yang ditambahin
4. cek tampilannya di viewport hp
5. pastiin data masih ada setelah refresh (localstorage)

---

## struktur project

```
TaskFlow/
├── index.html     # struktur html
├── style.css      # semua style dan animasi
├── script.js      # logika app
├── README.md      # dokumentasi project
└── .gitignore     # git ignore rules
```

---

## code style

- **html**: pake elemen semantik, indentasi 4 spasi
- **css**: pake css variables dari `:root`, penamaan mirip bem
- **javascript**: pake jsdoc comments, `const`/`let` (gak pake `var`), nama fungsi yang deskriptif

---

## anggota tim

| nim | nama | peran |
|---|---|---|
| 001202400200 | sultan zhalifunnas musyaffa | project lead & core features |
| 001202400069 | risly maria theresia worung | ui/ux design |
| 001202400040 | misha andalusia | task features |
| 001202400054 | fathir barhouti awlya | search & storage |

---

makasih udah kontribusi!
