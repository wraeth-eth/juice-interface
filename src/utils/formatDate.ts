import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
formatDistance(new Date(1536484369695), new Date())

export const formatDate = (
  dateMillis: BigNumberish,
  dateFormat = 'M-d-yy h:mma',
): string => format(new Date(BigNumber.from(dateMillis).toNumber()), dateFormat)

export const formatHistoricalDate = (dateMillis: BigNumberish): string =>
  formatDistance(new Date(BigNumber.from(dateMillis).toNumber()), new Date(), {
    addSuffix: true,
  })
