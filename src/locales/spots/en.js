export default {
  // Titles and navigation
  title: 'Spots',
  mySpots: 'My Spots',
  allSpots: 'All Spots',
  favoriteSpots: 'Favorite Spots',
  
  // States
  noSpots: 'No spots available',
  noSpotsDescription: 'You haven\'t created any spots yet. Create your first spot to get started!',
  addFirstSpot: 'Create first spot',
  showing: 'Showing {count} of {total} spots',
  
  // Actions
  createSpot: 'Create Spot',
  editSpot: 'Edit Spot',
  deleteSpot: 'Delete Spot',
  viewSpot: 'View Spot',
  addToFavorites: 'Add to favorites',
  removeFromFavorites: 'Remove from favorites',
  
  // Spot properties
  name: 'Name',
  description: 'Description',
  type: 'Type',
  difficulty: 'Difficulty',
  coordinates: 'Coordinates',
  noLocation: 'No location',
  
  // Visibility
  public: 'Public',
  private: 'Private',
  followersOnly: 'Followers only',
  
  // Spot types
  types: {
    mountain: 'Mountain',
    beach: 'Beach',
    forest: 'Forest',
    urban: 'Urban',
    field: 'Field',
    desert: 'Desert',
    lake: 'Lake',
    river: 'River',
    other: 'Other'
  },
  
  // Difficulties
  difficulty: {
    title: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert'
  },
  
  // Legal statuses
  legalStatus: {
    noRestrictions: 'No restrictions',
    restrictedZone: 'Restricted zone',
    prohibitedZone: 'Prohibited zone',
    notAnalyzed: 'Not analyzed',
    noRestrictionsDescription: 'This spot has no known aeronautical restrictions.',
    restrictedZoneDescription: 'This spot is in a zone with aeronautical restrictions.',
    prohibitedZoneDescription: 'This spot is in a prohibited flight zone.',
    notAnalyzedDescription: 'The aeronautical status of this spot has not been analyzed.'
  },
  
  // Form
  form: {
    title: 'Spot Information',
    name: 'Spot name',
    description: 'Description',
    location: 'Location',
    selectLocation: 'Select location',
    locationHelp: 'Click on the map to select the spot location',
    legalStatus: 'Legal Status',
    calculatingLegalStatus: 'Calculating legal status...',
    visibility: 'Visibility',
    sections: {
      basic: 'Basic Information',
      location: 'Location',
      privacy: 'Privacy'
    },
    namePlaceholder: 'Spot name',
    descriptionPlaceholder: 'Describe your spot...',
    publicDescription: 'Visible to all users',
    visibleToFollowersOnlyDescription: 'Only visible to your followers'
  },
  
  // Deletion
  delete: {
    title: 'Delete Spot',
    confirmation: 'Are you sure you want to delete "{name}"?',
    success: 'Spot deleted successfully',
    error: 'Error deleting spot'
  },
  
  // Success/error messages
  created: 'Spot created successfully',
  updated: 'Spot updated successfully',
  error: 'Error processing request'
}