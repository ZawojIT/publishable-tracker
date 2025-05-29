import type { CollectionConfig } from 'payload'

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: {
    defaultColumns: ['name', 'createdAt'],
    group: 'Reviews',
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'The name of the department',
        readOnly: true,
      },
      required: true,
    },
    {
      name: 'members',
      type: 'relationship',
      hasMany: true,
      relationTo: 'users',
    },
  ],
}
