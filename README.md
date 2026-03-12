# taskflow — smart task manager

> aplikasi web task manager pake vanilla html, css, sama javascript.
> desainnya minimalist hitam putih.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## daftar isi

- [fitur](#fitur)
- [demo](#demo)
- [cara mulai](#cara-mulai)
- [teknologi](#teknologi)
- [struktur project](#struktur-project)
- [keyboard shortcuts](#keyboard-shortcuts)
- [anggota tim](#anggota-tim)
- [git workflow](#git-workflow)
- [contributing](#contributing)
- [license](#license)

---

## fitur

### fitur utama
| fitur | keterangan |
|---|---|
| **tambah task** | tambahin task baru lewat form input yang simpel |
| **selesaikan task** | centang task yang udah kelar, ada animasi checkboxnya |
| **edit task** | double-click atau pencet tombol edit buat ubah teks task |
| **hapus task** | hapus task pake animasi slide-out |
| **deteksi duplikat** | gak bisa nambahin task yang sama dua kali |

### search & filter
| fitur | keterangan |
|---|---|
| **search realtime** | langsung ketemu pas ngetik, ada highlightnya |
| **filter task** | tampilkan semua, aktif, atau yang udah kelar |
| **task counter** | hitungan jumlah task yang masih aktif |
| **clear completed** | hapus semua task yang udah selesai sekaligus |

### fitur tambahan
| fitur | keterangan |
|---|---|
| **task priority** | set prioritas low, medium, high — ada badge warnanya |
| **drag & drop** | atur urutan task pake drag, ada handle visualnya |
| **export ke json** | download semua task jadi file `.json` |
| **import dari json** | restore task dari file `.json` yang udah di-export |
| **animated placeholder** | efek typewriter di input field, teksnya ganti-ganti |

### ux & desain
| fitur | keterangan |
|---|---|
| **tema b&w** | desain hitam putih yang clean |
| **svg icons** | semua ikon pake svg, jadi tajam di semua resolusi |
| **toast notifications** | notifikasi dark pill buat setiap aksi |
| **keyboard shortcuts** | `enter` buat nambah, `escape` buat cancel, `ctrl+k` buat search |
| **local storage** | data tetep ada walaupun browser ditutup |
| **responsive** | tampilannya bagus di desktop, tablet, sama hp |
| **animasi halus** | micro-animations buat transisi task |

---

## demo

buat jalanin appnya, tinggal buka `index.html` di browser. gak perlu server atau install apa-apa.

---

## cara mulai

### prasyarat

- browser modern (chrome, firefox, edge, safari)
- gak perlu server atau dependencies

### instalasi

1. clone repo ini:
   ```bash
   git clone https://github.com/Sultan-skibidi/TaskFlow.git
   ```

2. masuk ke folder project:
   ```bash
   cd TaskFlow
   ```

3. buka `index.html` di browser:
   ```bash
   # windows
   start index.html

   # macos
   open index.html

   # atau pake live server extension di vs code
   ```

---

## teknologi

| teknologi | fungsi |
|---|---|
| **html5** | struktur halaman & aksesibilitas |
| **css3** | styling, animasi, responsive, css variables |
| **javascript (es6+)** | logika app, dom manipulation, drag & drop api |
| **localstorage api** | nyimpen data di sisi client |
| **filereader api** | fungsi import/export json |
| **google fonts (inter)** | tipografi yang clean |

> project ini gak pake library atau framework eksternal sama sekali — semuanya vanilla.

---

## struktur project

```
TaskFlow/
├── index.html         # struktur html utama
├── style.css          # semua style, tema, dan animasi
├── script.js          # logika app (crud, search, filter, d&d, export/import)
├── .gitignore         # git ignore rules
├── CONTRIBUTING.md    # panduan kontribusi
├── GIT_GUIDE.md       # panduan git workflow (bahasa indonesia)
└── README.md          # dokumentasi project (file ini)
```

---

## keyboard shortcuts

| shortcut | aksi |
|---|---|
| `enter` | tambahin task baru / save task yang diedit |
| `escape` | cancel editing / clear search |
| `ctrl + k` | fokus ke search bar |
| `double-click` | edit task secara inline |

---

## anggota tim & pembagian tugas

| nim | nama | peran | branch |
|---|---|---|---|
| 001202400200 | sultan zhalifunnas musyaffa | project lead & fitur lanjutan | `main`, `feature-super-maximal` |
| 001202400069 | risly maria theresia worung | ui/ux design (tema b&w) | `feature-ui-design` |
| 001202400040 | misha andalusia | logika js utama & drag/drop | `feature-add-task` |
| 001202400054 | fathir barhouti awlya | task actions & animated placeholder | `feature-task-actions` |

---

## git workflow

project ini pake **feature-branch workflow** dengan pull requests dan code review:

1. **main branch** — kode yang udah production-ready
2. **feature branches** — tiap fitur dikerjain terpisah
3. **pull requests** — fitur di-review terus di-merge lewat pr
4. **code reviews** — anggota tim saling review kode masing-masing

### branch history

```
main
├── feature-ui-design        <- struktur html & css tema b&w (risly)
├── feature-add-task         <- add task, render dom, drag & drop (misha)
├── feature-task-actions     <- edit, complete, delete, search, placeholder (fathir)
└── feature-super-maximal    <- priority, export/import, fitur lanjutan (sultan)
```

> buat panduan git step-by-step (bahasa indonesia), cek [`GIT_GUIDE.md`](GIT_GUIDE.md).

---

## contributing

baca [CONTRIBUTING.md](CONTRIBUTING.md) buat panduan soal:
- penamaan branch
- format commit message
- testing
- code style

---

## license

project ini dibuat buat keperluan tugas kuliah.

---

<p align="center">
  dibuat sama <b>tim taskflow</b>
</p>
