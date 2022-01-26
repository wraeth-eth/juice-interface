import { Form } from 'antd'

import { FormItemExt } from '../formItemExt'
import { ETHAddressInput } from './ETHAddressInput'

export default function ETHAddressFormItem({
  name,
  formItemProps,
  onAddressChange,
  initialValue,
}: FormItemExt & {
  onAddressChange?: (address: string | undefined) => void
  initialValue: string | undefined
}) {
  return (
    <Form.Item validateTrigger={false} name={name} {...formItemProps}>
      <ETHAddressInput
        onChange={v => onAddressChange?.(v)}
        initialValue={initialValue}
      />
    </Form.Item>
  )
}
