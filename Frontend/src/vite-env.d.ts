/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_RECOMMENDED_STORAGE_PLAN_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
