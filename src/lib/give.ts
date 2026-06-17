export type GiveCategory = {
  id: string
  title: string
  subtitle: string
  description: string
}

export const GIVING_CATEGORIES: GiveCategory[] = [
  {
    id: 'tithe',
    title: 'Tithe',
    subtitle: 'Honoring God',
    description: 'Honoring God with the firstfruits of what He has given.',
  },
  {
    id: 'offering',
    title: 'Offering',
    subtitle: 'Worship through generosity',
    description: 'Worship through generosity.',
  },
  {
    id: 'missions',
    title: 'Missions & Outreach',
    subtitle: 'Reaching Kitengela and beyond',
    description: 'Reaching Kitengela and beyond.',
  },
  {
    id: 'building',
    title: 'Building Fund',
    subtitle: 'Growing our house of worship',
    description: 'Growing our house of worship.',
  },
]

export type GiveSettings = {
  paybillNumber: string
  accountNumber: string
  accountSuffixes: string[]
  bankName: string
  bankAccountName: string
  bankAccountNumber: string
  bankBranch: string
}

export const DEFAULT_GIVE_SETTINGS: GiveSettings = {
  paybillNumber: '400222',
  accountNumber: '1756443',
  accountSuffixes: ['#offering/tithe', '#missions', '#building'],
  bankName: 'Co-operative Bank',
  bankAccountName: 'Athi River VOSH Church',
  bankAccountNumber: 'Contact finance team for details',
  bankBranch: 'Kitengela Branch',
}

export function normalizeGiveSettings(row: Record<string, unknown> | null | undefined): GiveSettings {
  if (!row) return DEFAULT_GIVE_SETTINGS

  const suffixesRaw = row.account_suffixes ?? row.accountSuffixes
  const suffixes = Array.isArray(suffixesRaw)
    ? suffixesRaw.map(String)
    : typeof suffixesRaw === 'string'
      ? suffixesRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : DEFAULT_GIVE_SETTINGS.accountSuffixes

  return {
    paybillNumber: String(row.paybill_number ?? row.paybillNumber ?? DEFAULT_GIVE_SETTINGS.paybillNumber),
    accountNumber: String(row.account_number ?? row.accountNumber ?? DEFAULT_GIVE_SETTINGS.accountNumber),
    accountSuffixes: suffixes.length ? suffixes : DEFAULT_GIVE_SETTINGS.accountSuffixes,
    bankName: String(row.bank_name ?? row.bankName ?? DEFAULT_GIVE_SETTINGS.bankName),
    bankAccountName: String(row.bank_account_name ?? row.bankAccountName ?? DEFAULT_GIVE_SETTINGS.bankAccountName),
    bankAccountNumber: String(
      row.bank_account_number ?? row.bankAccountNumber ?? DEFAULT_GIVE_SETTINGS.bankAccountNumber,
    ),
    bankBranch: String(row.bank_branch ?? row.bankBranch ?? DEFAULT_GIVE_SETTINGS.bankBranch),
  }
}

export function formatMpesaAccount(settings: GiveSettings, suffix = '#offering/tithe') {
  return `${settings.accountNumber}${suffix}`
}
