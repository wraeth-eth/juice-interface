import { Trans } from '@lingui/macro'
import useProjectHandle from 'hooks/v2/contractReader/ProjectHandle'
import { CSSProperties } from 'react'
import Link from 'next/link'
import { v2ProjectRoute } from 'utils/routes'

export default function V2ProjectHandle({
  projectId,
  style,
}: {
  projectId: number
  style?: CSSProperties
}) {
  const { data: handle } = useProjectHandle({ projectId })

  return (
    <Link href={v2ProjectRoute({ projectId, handle })}>
      <div
        style={{ fontWeight: 500, ...style }}
        className="text-primary hover-text-action-primary hover-text-decoration-underline"
      >
        <span style={{ marginRight: '0.5rem' }}>
          {handle ? `@${handle}` : <Trans>Project {projectId}</Trans>}
        </span>
      </div>
    </Link>
  )
}
