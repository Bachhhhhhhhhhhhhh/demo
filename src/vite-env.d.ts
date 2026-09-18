/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHEET_WEBAPP_URL: string
  readonly VITE_SHEET_CSV_URL: string
  readonly VITE_ADMIN_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
