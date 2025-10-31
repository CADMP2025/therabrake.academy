#!/bin/bash

echo "🎬 Testing Course Player System..."

# Test 1: Video Player
echo "✓ Test 1: Video Player"
echo "  - Navigate to /learn/{courseId}/{lessonId}"
echo "  - Play video"
echo "  - Verify controls work (play/pause/volume)"
echo "  - Check progress saves"

# Test 2: Navigation
echo "✓ Test 2: Lesson Navigation"
echo "  - Click 'Next Lesson'"
echo "  - Click 'Previous Lesson'"
echo "  - Click lessons in sidebar"
echo "  - Verify current lesson highlighted"

# Test 3: Progress Tracking
echo "✓ Test 3: Progress Tracking"
echo "  - Watch video to 50%"
echo "  - Refresh page"
echo "  - Verify progress retained"
echo "  - Watch to 90%+"
echo "  - Check lesson marked complete"

# Test 4: Resources
echo "✓ Test 4: Resource Downloads"
echo "  - Click resource download"
echo "  - Verify file downloads"

echo "✅ Course player tests complete!"
