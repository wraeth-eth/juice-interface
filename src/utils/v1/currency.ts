import { CurrencyOption } from 'models/v1/currencyOption'
import { CSSProperties } from 'react'

import { CURRENCY_ETH, CURRENCY_USD } from 'constants/v1/currency'

const currencies: Record<
  CurrencyOption,
  { name: 'ETH' | 'USD'; symbol: 'Ξ' | 'US$'; style?: CSSProperties }
> = {
  [CURRENCY_ETH]: {
    name: 'ETH',
    symbol: 'Ξ',
    style: {
      fontFamily: 'sans-serif',
    },
  },
  [CURRENCY_USD]: {
    name: 'USD',
    symbol: 'US$',
  },
}

export const currencyName = (
  currency?: CurrencyOption,
): typeof currencies[keyof typeof currencies]['name'] | undefined =>
  currency !== undefined ? currencies[currency].name : undefined

export const currencySymbol = (currency?: CurrencyOption) =>
  currency !== undefined ? currencies[currency].symbol : undefined

export const currencyStyle = (currency?: CurrencyOption) =>
  currency !== undefined ? currencies[currency].style : undefined
