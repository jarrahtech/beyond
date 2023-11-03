interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly MODE: string
  readonly PACKAGE_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
