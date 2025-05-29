'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

const DepartmentReview: React.FC = () => {
  const { id } = useDocumentInfo()

  return (
    <div style={{ backgroundColor: 'var(--theme-elevation-50)', padding: '20px' }}>
      <h2>Department Reviews {id}</h2>
    </div>
  )
}

export default DepartmentReview
