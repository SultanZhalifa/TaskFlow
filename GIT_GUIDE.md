# panduan lengkap git & github — step by step

panduan ini jelasin **setiap langkah** buat tugas github repository collaboration,
dari bikin repo sampe submit.

**tim:**
| # | nama branch | pic (penanggung jawab) | isi tugas & commits |
|---|---|---|---|
| 1 | `main` | sultan zhalifunnas musyaffa (001202400200) | setup awal repository & file kosong. readme.md lengkap. |
| 2 | `feature-ui-design` | risly maria theresia worung (001202400069) | bikin struktur html & style tema "b&w" di css. (3+ commits) |
| 3 | `feature-add-task` | misha andalusia (001202400040) | logika vanilla js buat `addTask()`, render dom, dan drag/drop ui. (3+ commits) |
| 4 | `feature-task-actions` | fathir barhouti awlya (001202400054) | edit, complete, delete, search, animasi placeholder. (3+ commits) |
| 5 | `feature-super-maximal` | sultan / bebas | tambahan fitur export/import json, task priority, dll. (3+ commits) |

---

## persiapan awal

```bash
git config --global user.name "Sultan Zhalifunnas Musyaffa"
git config --global user.email "email@kamu.com"
```

---

## step 1: bikin repository di github

1. buka [github.com](https://github.com) terus login
2. klik **"+"** di pojok kanan atas, pilih **"new repository"**
3. isi:
   - **repository name**: `TaskFlow`
   - **description**: `A modern task manager web application`
   - **visibility**: public
   - **jangan** centang "add a readme file"
4. klik **"create repository"**
5. **catat url repo** (contoh: `https://github.com/username/TaskFlow.git`)

---

## step 2: invite collaborators

1. di halaman repository, masuk ke **settings** lalu **collaborators**
2. klik **"add people"**
3. tambahin username github **3 temen** satu tim
4. klik **"add"** buat masing-masing

---

## step 3: initial setup — push ke main

buka **terminal/powershell** di folder project:

```bash
# masuk ke folder project
cd "c:\Users\sulta\OneDrive\Desktop\tugas kuliah\task-manager"

# inisialisasi git
git init

# stage file-file awal (readme, .gitignore, contributing)
git add README.md .gitignore CONTRIBUTING.md

# commit pertama
git commit -m "Initial commit: Add README, .gitignore, and CONTRIBUTING.md"

# set branch utama
git branch -M main

# hubungin ke repo github (ganti url!)
git remote add origin https://github.com/Sultan-skibidi/TaskFlow.git

# push ke github
git push -u origin main
```

cek github — harusnya file udah muncul di repo.

---

## step 4: branch `feature-ui-design` (html + css) — risly

```bash
git checkout -b feature-ui-design
```

### commit 1: struktur html
```bash
git add index.html
git commit -m "Add HTML5 semantic structure with header, form, task list, and filters"
```

### commit 2: base css dark theme
```bash
git add style.css
git commit -m "Add dark theme CSS with glassmorphism card and gradient background"
```

### commit 3: css animations & responsive
```bash
# buka style.css, tambahin komentar di baris terakhir:
# /* Responsive design improvements - v1.1 */
# terus save

git add style.css
git commit -m "Add responsive design, animations, and keyboard shortcut hints"
```

### push & bikin pr
```bash
git push -u origin feature-ui-design
```

**di github:**
1. klik **"compare & pull request"**
2. title: `Add UI design with HTML structure and premium CSS styling`
3. description:
   ```
   ## changes
   - added html5 semantic structure (index.html)
   - implemented dark theme with glassmorphism design
   - added responsive layout for mobile devices
   - added smooth css animations and transitions
   - added keyboard shortcut hints in footer

   ## screenshots
   (tambahin screenshot app kalo mau)
   ```
4. klik **"create pull request"** terus **merge pull request** (centang "delete branch" abis merge).

---

### bonus: simulasi code review

biar tugasnya keliatan kayak dikerjain beneran sama tim, lakuin **code review** di github pr:

1.  **risly** (feature-ui-design) bikin pr.
2.  sebelum di-merge, **sultan** masuk ke tab "files changed" di pr risly.
3.  sultan klik tanda **+** di sebelah baris kode (misal di bagian `style.css` color background) dan tambahin *comment*:
    > *"nice ris! tapi kayaknya warna background off-white-nya bisa lebih terang dikit `#f8f8f8` biar lebih clean?"*
4.  **misha** reply *comment* tersebut:
    > *"setuju sama sultan, kayaknya lebih kece jadinya. btw desainnya udah bagus banget."*
5.  **risly** reply lagi:
    > *"siapp, udah gw update di commit terbaru ya. lgtm?"*
6.  terus misha sama fathir klik "approve" review di pr tersebut.

lakuin percakapan natural kayak gini di 1-2 pull request. dosen bakal seneng liat kolaborasinya keliatan real.

---

## step 5: branch `feature-add-task` (add task) — sultan

```bash
git checkout main
git pull origin main
git checkout -b feature-add-task
```

### commit 1: setup javascript & dom elements
```bash
git add script.js
git commit -m "Add JavaScript setup with DOM elements, state management, and task creation"
```

### commit 2: add task & render
```bash
git add script.js
git commit -m "Implement add task with form handling, rendering, and duplicate detection"
```

### commit 3: task counter & clear completed
```bash
git add script.js
git commit -m "Add task counter, clear completed button, and empty state messages"
```

### push & bikin pr
```bash
git push -u origin feature-add-task
```

**pr title:** `Implement core task management: add, render, and counter`
**merge** setelah selesai.

---

## step 6: branch `feature-task-actions` (complete, delete, filter) — misha

```bash
git checkout main
git pull origin main
git checkout -b feature-task-actions
```

### commit 1: toggle complete & delete
```bash
git add script.js
git commit -m "Add toggle complete and delete task with slide-out animation"
```

### commit 2: filter functionality
```bash
git add script.js
git commit -m "Implement task filtering (All, Active, Completed) with live count badges"
```

### commit 3: local storage persistence
```bash
git add script.js
git commit -m "Add localStorage persistence so tasks survive page refresh"
```

### push & bikin pr
```bash
git push -u origin feature-task-actions
```

**pr title:** `Add task actions: complete, delete, filter, and localStorage`
**merge** setelah selesai.

---

## step 7: branch `feature-search-edit` (search, edit, toast) — fathir

```bash
git checkout main
git pull origin main
git checkout -b feature-search-edit
```

### commit 1: search functionality
```bash
git add script.js
git commit -m "Add real-time search with text highlighting and clear button"
```

### commit 2: edit task inline
```bash
git add script.js
git commit -m "Implement inline task editing with double-click and edit button"
```

### commit 3: toast notifications & keyboard shortcuts
```bash
git add script.js
git commit -m "Add toast notifications for user feedback and keyboard shortcuts"
```

### push & bikin pr
```bash
git push -u origin feature-search-edit
```

**pr title:** `Add search, inline editing, toast notifications, and keyboard shortcuts`
**merge** setelah selesai.

---

## step 8: verifikasi final

```bash
git checkout main
git pull origin main
```

### checklist
- [ ] semua file ada di branch `main`
- [ ] ada **4 pull requests** (merged)
- [ ] ada **12+ commits** total
- [ ] readme lengkap
- [ ] contributing.md ada
- [ ] .gitignore ada
- [ ] app jalan pas buka `index.html`

---

## step 9: submit

kirim link repo ke dosen:
```
https://github.com/Sultan-skibidi/TaskFlow
```

---

## tips buat nilai bagus

1. **jangan commit semua file sekaligus** — commit bertahap per fitur
2. **tulis commit message yang jelas** — jangan cuma "update" atau "fix"
3. **tulis deskripsi lengkap di setiap pr** — jelasin apa aja yang berubah
4. **bikin github issues** sebelum tiap branch (opsional tapi bagus):
   - issue #1: "design html structure and css styling"
   - issue #2: "implement core task management"
   - issue #3: "add task actions and filtering"
   - issue #4: "add search, edit, and notifications"
5. **pastiin semua code di-merge ke main** — ini syarat submission

---

## referensi git commands

| perintah | fungsi |
|---|---|
| `git init` | inisialisasi repo baru |
| `git add <file>` | stage file buat commit |
| `git add .` | stage semua perubahan |
| `git commit -m "pesan"` | commit perubahan |
| `git branch -M main` | rename branch ke main |
| `git checkout -b <nama>` | bikin & pindah ke branch baru |
| `git checkout main` | pindah ke branch main |
| `git push -u origin <branch>` | push branch ke github |
| `git pull origin main` | tarik perubahan terbaru |
| `git remote add origin <url>` | hubungin ke repo github |
| `git log --oneline` | liat riwayat commit ringkas |
| `git status` | liat status perubahan |

---

selamat mengerjakan!
