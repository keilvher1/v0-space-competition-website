// 관리자 폼 필드 정의. 화면은 components/admin/schema-form.tsx가 이 정의대로 그린다.

export type Option = { value: string; label: string }

type Base = { name: string; label: string; help?: string }

export type FieldDef =
  | (Base & { kind: "text" | "url" | "email" | "password"; placeholder?: string; required?: boolean })
  | (Base & { kind: "textarea"; rows?: number; placeholder?: string })
  | (Base & { kind: "number"; placeholder?: string })
  | (Base & { kind: "color" })
  | (Base & { kind: "image" })
  | (Base & { kind: "datetime" })
  | (Base & { kind: "switch" })
  | (Base & { kind: "select"; options: Option[] })
  | (Base & { kind: "strings"; multiline?: boolean; placeholder?: string; addLabel?: string })
  | (Base & { kind: "colors" })
  | (Base & { kind: "checkboxes"; options: Option[]; numeric?: boolean })
  | (Base & { kind: "list"; fields: FieldDef[]; itemLabel: string; summaryField?: string })
  | { kind: "group"; label: string; name?: string; help?: string; fields: FieldDef[]; open?: boolean }

export type SaveResult = { ok: true; id?: string; message?: string } | { ok: false; error: string }
