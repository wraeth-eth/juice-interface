import { Input } from 'antd'
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons'
import debounce from 'lodash/debounce'
import React, {
  useState,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
} from 'react'
import { constants, utils } from 'ethers'
import { ThemeContext } from 'contexts/themeContext'

import { readProvider } from 'constants/readProvider'

// import { readProvider } from 'constants/readProvider'

type ENSAddressInputValue = string | undefined

interface ENSAddressProps {
  onChange?: (value: ENSAddressInputValue) => void
  initialValue?: string | undefined
}

/**
 * Custom input component for ETH addresses.
 *
 * This input is unidirectional. It only emits events up the tree (via `onChange`),
 * and doesn't have a `value` prop.
 *
 * Initially, it triggers `onChange`.
 * Then, it will trigger `onChange` in response to the input's `onChange` handler.
 *
 */
export function ETHAddressInput({ onChange, initialValue }: ENSAddressProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [inputContents, setInputContents] = useState<string>()
  const [inputSubText, setInputSubText] = useState<string>()
  const [loading, setLoading] = useState<boolean>()

  const triggerChange = useCallback(
    (value: ENSAddressInputValue) => {
      onChange?.(value)
    },
    [onChange],
  )

  const read = useMemo(
    () =>
      debounce(async (value: string | undefined) => {
        if (!value) {
          return
        }

        try {
          const address = await readProvider.resolveName(value)

          if (typeof address !== 'string' || !utils.isAddress(address)) {
            throw new Error(
              `Address [${address}] for value [${value}] isn't a valid address.`,
            )
          }

          triggerChange(address) // address
          setInputSubText(address)
        } catch (err) {
          console.error('Error resolving ENS:', err)
        } finally {
          setLoading(false)
        }
      }, 250),
    [triggerChange],
  )

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setInputContents(value)

    setLoading(true)
    read(value)
  }

  // Set the initial value based on the provided `initialValue`.
  // This should only run once.
  useLayoutEffect(() => {
    setInputContents(initialValue)
    let isApiSubscribed = true

    const readENSName = async () => {
      if (!initialValue || !utils.isAddress(initialValue)) {
        return
      }

      setLoading(true)

      try {
        const name = await readProvider.lookupAddress(initialValue)

        if (!name) {
          return
        }

        // Reverse lookup to check validity
        const isValid =
          (await readProvider.resolveName(name))?.toLowerCase() ===
          initialValue.toLowerCase()
        if (!isValid || !isApiSubscribed) {
          return
        }

        setInputContents(name)
        setInputSubText(initialValue)
        triggerChange(initialValue) // address
      } catch (e) {
        console.log('Error looking up ENS name for address', initialValue, e)
      } finally {
        setLoading(false)
      }
    }

    readENSName()

    return () => {
      isApiSubscribed = false
      read.cancel()
    }
  }, [initialValue]) // eslint-disable-line react-hooks/exhaustive-deps

  const suffix = useMemo(() => {
    if (loading) {
      return <LoadingOutlined spin />
    }

    return <span />
  }, [loading])

  return (
    <div>
      <Input
        value={inputContents}
        onChange={onValueChange}
        className="err-suffix"
        placeholder={`juicebox.eth / ${constants.AddressZero}`}
        type="string"
        autoComplete="off"
        spellCheck={false}
        suffix={suffix}
      />

      {inputSubText && (
        <div style={{ fontSize: '0.7rem', color: colors.text.secondary }}>
          <CheckCircleFilled /> {inputSubText}
        </div>
      )}
    </div>
  )
}
