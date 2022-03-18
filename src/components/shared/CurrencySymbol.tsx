import { CurrencyContext } from 'contexts/currencyContext'
import { CSSProperties, useContext } from 'react'

import { V1CurrencyOption } from 'models/v1/currencyOption'
import { V2CurrencyOption } from 'models/v2/currencyOption'

export default function CurrencySymbol({
  currency,
  style,
}: {
  currency: V1CurrencyOption | V2CurrencyOption
  style?: CSSProperties
}) {
  const { currencyMetadata } = useContext(CurrencyContext)
  const metadata = currencyMetadata[currency]

  return (
    <span
      style={{
        ...style,
        ...metadata.style,
      }}
    >
      {metadata.symbol}
    </span>
  )
}
