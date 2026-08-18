export type CurrencyDisplay = {
  country: string
  countryCode: string
  symbol: string
  code: string
  rate: number
}

export const currencyTable: Record<
  string,
  CurrencyDisplay
> = {
  UK: {
    country: 'United Kingdom',
    countryCode: 'GB',
    symbol: '£',
    code: 'GBP',
    rate: 1,
  },

  USA: {
    country: 'United States',
    countryCode: 'US',
    symbol: '$',
    code: 'USD',
    rate: 1.27,
  },

  Canada: {
    country: 'Canada',
    countryCode: 'CA',
    symbol: 'CA$',
    code: 'CAD',
    rate: 1.72,
  },

  Australia: {
    country: 'Australia',
    countryCode: 'AU',
    symbol: 'A$',
    code: 'AUD',
    rate: 1.93,
  },
}

export const defaultCurrency =
  currencyTable.UK

export function getCurrencyForCountrySystem(
  countrySystem:
    | string
    | null
    | undefined,
): CurrencyDisplay {
  if (
    countrySystem &&
    currencyTable[countrySystem]
  ) {
    return currencyTable[
      countrySystem
    ]
  }

  return defaultCurrency
}

export function getCurrencyForCountryCode(
  countryCode:
    | string
    | null
    | undefined,
): CurrencyDisplay {
  const normalised =
    countryCode
      ?.trim()
      .toUpperCase()

  const match =
    Object.values(currencyTable).find(
      (item) =>
        item.countryCode === normalised,
    )

  return match ?? defaultCurrency
}

export function convertGbpPrice(
  gbpAmount: number,
  currency: CurrencyDisplay,
  decimals = false,
) {
  const converted =
    gbpAmount *
    currency.rate

  const value =
    decimals
      ? converted.toFixed(2)
      : Math.round(
          converted,
        ).toString()

  return `${currency.symbol}${value}`
}