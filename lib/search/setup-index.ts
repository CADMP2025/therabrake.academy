import { meiliServerClient, COURSES_INDEX } from './meilisearch-client';

export async function setupCoursesIndex() {
  try {
    const index = meiliServerClient.index(COURSES_INDEX);

    // Configure searchable attributes
    await index.updateSearchableAttributes([
      'title',
      'description',
      'instructor_name',
      'category',
    ]);

    // Configure filterable attributes
    await index.updateFilterableAttributes([
      'category',
      'ce_hours',
      'price',
      'level',
      'is_published',
      'texas_approved',
      'average_rating',
    ]);

    // Configure sortable attributes
    await index.updateSortableAttributes([
      'created_at',
      'updated_at',
      'price',
      'ce_hours',
      'enrollment_count',
      'average_rating',
    ]);

    // Configure ranking rules
    await index.updateRankingRules([
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
      'average_rating:desc',
      'enrollment_count:desc',
    ]);

    // Configure typo tolerance
    await index.updateTypoTolerance({
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8,
      },
    });

    // Configure pagination
    await index.updatePaginationSettings({
      maxTotalHits: 1000,
    });

    console.log('✅ Courses index configured successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to setup courses index:', error);
    return { success: false, error: error.message };
  }
}
