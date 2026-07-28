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
    description: 'Worship through generosity as part of our Sunday giving.',
  },
  {
    id: 'development',
    title: 'Development',
    subtitle: 'Growing the work',
    description: 'Support church development and ongoing ministry needs.',
  },
  {
    id: 'building',
    title: 'Building Fund',
    subtitle: 'Raising the house of worship',
    description: 'Partner with us as we build — give toward the construction project.',
  },
]

export type GiveSettings = {
  paybillNumber: string
  accountNumber: string
  accountSuffixes: string[]
  buildingPaybillNumber: string
  buildingAccountNumber: string
  bankName: string
  bankAccountName: string
  bankAccountNumber: string
  bankBranch: string
}

/** Tithe / offering / development — Paybill 4004004222, Account 33985#… */
export const DEFAULT_GIVE_SETTINGS: GiveSettings = {
  paybillNumber: '4004004222',
  accountNumber: '33985',
  accountSuffixes: ['#offering', '#tithe', '#development'],
  buildingPaybillNumber: '4009307',
  buildingAccountNumber: 'BUILDING',
  bankName: 'Co-operative Bank',
  bankAccountName: 'VOSH Church International Kitengela',
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
    buildingPaybillNumber: String(
      row.building_paybill_number ??
        row.buildingPaybillNumber ??
        DEFAULT_GIVE_SETTINGS.buildingPaybillNumber,
    ),
    buildingAccountNumber: String(
      row.building_account_number ??
        row.buildingAccountNumber ??
        DEFAULT_GIVE_SETTINGS.buildingAccountNumber,
    ),
    bankName: String(row.bank_name ?? row.bankName ?? DEFAULT_GIVE_SETTINGS.bankName),
    bankAccountName: String(row.bank_account_name ?? row.bankAccountName ?? DEFAULT_GIVE_SETTINGS.bankAccountName),
    bankAccountNumber: String(
      row.bank_account_number ?? row.bankAccountNumber ?? DEFAULT_GIVE_SETTINGS.bankAccountNumber,
    ),
    bankBranch: String(row.bank_branch ?? row.bankBranch ?? DEFAULT_GIVE_SETTINGS.bankBranch),
  }
}

export function formatMpesaAccount(settings: GiveSettings, suffix = '#offering') {
  return `${settings.accountNumber}${suffix}`
}
