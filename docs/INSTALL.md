# ติดตั้ง glass-ui ผ่าน shadcn

glass-ui เป็น **shadcn GitHub registry** — ไม่ใช่ npm package. `shadcn` CLI อ่าน `registry.json` จาก repo นี้บน GitHub โดยตรง แล้ว **ก๊อปซอร์สโค้ดเข้าโปรเจกต์ของคุณ** — โค้ดเป็นของโปรเจกต์นั้นทันที แก้ได้เต็มที่

## 1. เตรียมโปรเจกต์ (ครั้งเดียว)

ต้องเป็นโปรเจกต์ React + Tailwind CSS v4 ที่ `shadcn init` แล้ว

```bash
npx shadcn@latest init
```

คำสั่งนี้สร้าง `components.json` (บอก CLI ว่าไฟล์ CSS อยู่ไหน และ alias `@/components`, `@/lib`, `@/hooks` ชี้ไปไหน) และตั้งค่า Tailwind

repo เป็น public — ไม่ต้อง login. (ถ้าวันหลังเปลี่ยนเป็น private: `gh auth login` บนเครื่อง หรือ `GH_TOKEN` ใน CI — fine-grained PAT สิทธิ์ Contents: read-only)

## 2. ติดตั้ง

```bash
# theme ก่อน: สี, กระจก, ฟอนต์
npx shadcn@latest add NTCHz/glass-ui/theme

# แล้วตามด้วย component ที่ต้องการ
npx shadcn@latest add NTCHz/glass-ui/button NTCHz/glass-ui/dialog NTCHz/glass-ui/sidebar
```

ชื่อ item = ชื่อไฟล์ใน `src/components/ui/` (เช่น `dropdown-menu`, `input-otp`, `code-block`) — ดูรายชื่อทั้งหมดใน README

ใส่พื้นหลังให้กระจกมีอะไรให้หักเห:

```tsx
<body className="glass-backdrop">
```

## 3. เบื้องหลังตอนสั่ง `add NTCHz/glass-ui/dialog`

1. **หา registry** — `NTCHz/glass-ui/dialog` = `owner/repo/item`. CLI อ่าน `registry.json` ที่ root ของ branch หลัก (`main`) แล้วหา item ชื่อ `dialog`
2. **ตาม dependency ของ registry** — `dialog` มี `registryDependencies: ["NTCHz/glass-ui/theme", "NTCHz/glass-ui/button"]` → ติดตั้งสองตัวนั้นให้ด้วย (ถ้ามีอยู่แล้ว CLI ถามก่อนทับ)
3. **ผสาน theme เข้า CSS ของคุณ** (ไฟล์ที่ `components.json` ชี้)
   - สี/token ลง `:root` และ `.dark` และ map เป็น `--color-*` ใน `@theme inline` → ใช้ `bg-primary`, `bg-field`, `text-success-text` ฯลฯ ได้
   - `@utility glass-clear | glass | glass-thick | glass-press | glass-backdrop`
   - `@import` ของ `tw-animate-css`, `shadcn/tailwind.css` และฟอนต์ Inter + Sarabun
4. **ติดตั้ง npm package** ตาม `dependencies` ของแต่ละ item (เช่น `@base-ui/react`, `cn`, `lucide-react`) ด้วย package manager ของโปรเจกต์
5. **เขียนไฟล์** ไปที่ `components/ui/dialog.tsx` และ rewrite import (`@/components/ui/button` ฯลฯ) ให้ตรง alias ใน `components.json`

ดูก่อนโดยไม่เขียนไฟล์:

```bash
npx shadcn@latest add NTCHz/glass-ui/sidebar --dry-run
npx shadcn@latest view NTCHz/glass-ui/sidebar
```

## 4. หลังติดตั้ง

- **โค้ดเป็นของคุณ** — แก้ใน `components/ui/*` ได้ตรงๆ ไม่ต้อง fork
- **อัปเดต** — fix ใน glass-ui ไม่ไหลมาเอง; สั่ง `add` ซ้ำ (CLI ถามก่อนทับ) หรือ `--overwrite`. ถ้าแก้ไฟล์ไปแล้ว ให้ดู diff ก่อนทับ
- **ล็อกเวอร์ชัน** — ต่อท้ายด้วย git tag: `NTCHz/glass-ui/button#v0.3.0`. ข้อควรรู้: ref ไม่ส่งต่อให้ dependency — `button#v0.3.0` ยังดึง `theme` จาก `main`. จะล็อกทั้งชุดให้ระบุ tag กับ theme ด้วย
- **ปรับธีม** — แก้ค่าใน `:root` / `.dark` ของ CSS โปรเจกต์ (เช่น `--primary`, `--radius`, `--glass-blur`) ทุก component ตามทันที

## 5. กฎดีไซน์ย่อ

- กระจกเฉพาะชั้นที่ลอยเหนือเนื้อหา (sidebar, toolbar, เมนู, dialog, toast). Card, table, ช่องกรอก = ทึบ
- `glass-thick` สำหรับ overlay ที่มีตัวหนังสือเยอะ, `glass-clear` เฉพาะบนรูป/วิดีโอ
- อย่าใส่ `bg-*` / `shadow-*` / `ring-1` คู่กับ `glass*` บน element เดียวกัน
- เปิด `prefers-reduced-transparency` หรือ `prefers-contrast: more` → กระจกกลายเป็นพื้นทึบอัตโนมัติ

รายละเอียดเต็ม: [`DESIGN.md`](../DESIGN.md) · เหตุผลเบื้องหลัง: [`docs/DECISIONS.md`](DECISIONS.md)

## 6. สำหรับคนดูแล repo นี้

```bash
pnpm install && pnpm dev            # catalog ที่ src/App.tsx
pnpm registry:gen                   # สร้าง item ใน registry.json ใหม่จาก import (หลังเพิ่ม/แก้ component)
pnpm test && pnpm registry:validate
```

แก้ theme: แก้ item `theme` ใน `registry.json` → `pnpm theme:sync` เพื่อ sync CSS ของ playground (test จับถ้าไม่ตรงกัน)
