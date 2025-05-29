import type { CollectionSlug, Config } from 'payload'

import { createDepartmentReviewCollection } from './collections/department-reviews.js'
import { Departments } from './collections/index.js'
import { slugify } from './utils/slugify.js'

export type CollectionTrackerConfig = {
  collection_tracker: CollectionSlug
  departments_required_review: string[]
}

export type PublishableTrackerConfig = {
  /**
   * Configuration for collections that should be tracked with publishing workflows
   */
  collection_trackers: CollectionTrackerConfig[]
  disabled?: boolean
}

export const publishableTracker =
  (pluginOptions: PublishableTrackerConfig) =>
  (config: Config): Config => {
    if (!config.collections) {
      config.collections = []
    }

    // Add base collections
    config.collections = [...config.collections, Departments]

    /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * If your plugin heavily modifies the database schema, you may want to remove this property.
     */
    if (pluginOptions.disabled) {
      return config
    }

    // Create review collections for each department
    const departmentTrackedCollections = new Map<string, Set<string>>()

    // First, collect all collections that each department needs to review
    pluginOptions.collection_trackers.forEach((tracker) => {
      tracker.departments_required_review.forEach((dept) => {
        if (!departmentTrackedCollections.has(dept)) {
          departmentTrackedCollections.set(dept, new Set())
        }
        departmentTrackedCollections.get(dept)?.add(tracker.collection_tracker)
      })
    })

    // Then create review collections for each department with their specific tracked collections
    departmentTrackedCollections.forEach((trackedCollections, deptSlug) => {
      if (config.collections) {
        config.collections.push(
          createDepartmentReviewCollection(deptSlug, Array.from(trackedCollections)),
        )
      }
    })

    if (!config.admin) {
      config.admin = {}
    }

    if (!config.admin.components) {
      config.admin.components = {}
    }

    if (!config.admin.components.beforeDashboard) {
      config.admin.components.beforeDashboard = []
    }

    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      if (incomingOnInit) {
        await incomingOnInit(payload)
      }

      // Get all unique department names from the configuration
      const departmentNames = new Set<string>()
      pluginOptions.collection_trackers.forEach((tracker) => {
        tracker.departments_required_review.forEach((dept) => {
          departmentNames.add(dept)
        })
      })

      // Create departments if they don't exist
      for (const deptName of departmentNames) {
        const deptSlug = slugify(deptName)

        // Check if department exists
        const { totalDocs } = await payload.count({
          collection: 'departments',
          where: {
            name: {
              equals: deptName,
            },
          },
        })

        if (totalDocs === 0) {
          // Create department with default workflow stages
          await payload.create({
            collection: 'departments',
            data: {
              name: deptName,
            },
          })
        }
      }
    }

    return config
  }
