import type { CollectionConfig } from 'payload'

import { slugify } from '../utils/slugify.js'

export const createDepartmentReviewCollection = (
  departmentSlug: string,
  trackedCollections: string[],
): CollectionConfig => ({
  slug: `${slugify(departmentSlug)}_reviews`,
  admin: {
    defaultColumns: ['item', 'trackedCollection', 'approved_date'],
    group: 'Reviews',
    useAsTitle: 'item',
  },
  fields: [
    {
      name: 'item',
      type: 'relationship',
      admin: {
        readOnly: true,
      },
      relationTo: trackedCollections,
      required: true,
    },
    {
      name: 'trackedCollection',
      type: 'select',
      admin: {
        readOnly: true,
      },
      options: trackedCollections.map((collection) => ({
        label: collection,
        value: collection,
      })),
      required: true,
    },
    {
      name: 'department',
      type: 'relationship',
      admin: {
        readOnly: true,
      },
      relationTo: 'departments',
      required: true,
    },
    {
      name: 'approved_date',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'MMM d, yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
    {
      name: 'approved_by',
      type: 'relationship',
      admin: {
        readOnly: true,
      },
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      admin: {
        readOnly: true,
      },
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Rejected',
          value: 'rejected',
        },
      ],
      required: true,
    },
    {
      name: 'comments',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
  ],
  labels: {
    plural: `${departmentSlug} Reviews`,
    singular: `${departmentSlug} Review`,
  },
})
