export default {
  title: 'Equipment',
  description: 'Manage your FPV equipment and tools',
  addItem: 'Add Equipment',
  editItem: 'Edit Equipment',
  noItems: 'No equipment registered',
  noItemsOfType: 'No equipment of this type',
  noItemsDescription: 'Start by adding your first equipment to keep a complete record of your FPV tools.',
  addFirst: 'Add {type}',
  addFirstItem: 'Add first equipment',
  addFirstDescription: 'Start by adding your first equipment to keep a complete record.',
  showing: 'Showing {count} of {total} items',
  noResults: 'No results found',
  noResultsDescription: 'Try adjusting your search filters or add new equipment.',
  selectType: 'Select equipment type',
  addFavorite: 'Add to favorites',
  removeFavorite: 'Remove from favorites',
  favorite: 'Favorite',
  viewProduct: 'View product',
  itemDetails: 'Equipment details',
  confirmDelete: 'Confirm deletion',
  deleteWarning: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
  loginDescription: 'Log in to manage your FPV equipment and tools.',
  statistics: 'Statistics',
  total: 'Total',
  loadingStats: 'Loading statistics...',
  
  stats: {
    total: 'Total Items',
    byStatus: 'By Status',
    count: 'Count',
    percentage: 'Percentage'
  },
  
  search: {
    placeholder: 'Search equipment...'
  },
  
  types: {
    all: 'All',
    drone: 'Drone',
    radio: 'Radio',
    goggles: 'FPV Goggles',
    battery: 'Battery',
    charger: 'Charger',
    others: 'Others'
  },
  
  conditions: {
    new: 'New',
    used: 'Used',
    refurbished: 'Refurbished',
    likeNew: 'Like New',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor'
  },
  
  status: {
    active: 'Active',
    archived: 'Archived',
    sold: 'Sold', 
    lost: 'Lost'
  },
  
  form: {
    name: 'Name',
    type: 'Type',
    brand: 'Brand',
    model: 'Model',
    brandModel: 'Brand and Model',
    condition: 'Condition',
    status: 'Status',
    price: 'Price',
    currency: 'Currency',
    purchaseDate: 'Purchase date',
    serialNumber: 'Serial number',
    warranty: 'Warranty',
    warrantyExpiration: 'Warranty expiration',
    location: 'Location',
    sourceUrl: 'Purchase URL',
    description: 'Description',
    notes: 'Notes',
    image: 'Image',
    favorite: 'Favorite',
    productLink: 'Product Link',
    basicInfo: 'Basic Information',
    multimedia: 'Links and Multimedia',
    options: 'Additional Options',
    selectEquipmentType: 'What type of equipment do you want to add?',
    selectEquipmentTypeDescription: 'Select the equipment type to continue',
    imagePreview: 'Image preview',
    fillDetails: 'Fill Details',
    steps: {
      selectType: 'Select Type',
      fillDetails: 'Fill Details'
    },
    placeholders: {
      name: 'Ex: DJI FPV Drone',
      brand: 'Ex: DJI',
      model: 'Ex: FPV',
      price: '0.00',
      serialNumber: 'Ex: ABC123456',
      location: 'Ex: Toolbox, Shelf A',
      sourceUrl: 'https://...',
      description: 'Describe the main features...',
      notes: 'Additional notes, condition, observations...',
      imageUrl: 'Product image URL',
      productLink: 'https://store.com/product',
      image: 'Product image URL'
    },
    
    typePlaceholder: 'Select a type'
  },
  
  warranty: {
    valid: 'Valid ({days} days remaining)',
    expiringSoon: 'Expiring soon ({days} days)',
    expired: 'Expired'
  },
  
  validation: {
    nameRequired: 'Name is required',
    typeRequired: 'Type is required',
    conditionRequired: 'Condition is required',
    priceInvalid: 'Price must be a valid number',
    dateInvalid: 'Date is not valid',
    urlInvalid: 'URL is not valid'
  },
  
  success: {
    created: 'Equipment created successfully',
    updated: 'Equipment updated successfully',
    deleted: 'Equipment deleted successfully',
    favoriteAdded: 'Added to favorites',
    favoriteRemoved: 'Removed from favorites'
  },
  
  errors: {
    loadFailed: 'Failed to load equipment',
    saveFailed: 'Failed to save equipment',
    deleteFailed: 'Failed to delete equipment',
    toggleFavoriteFailed: 'Failed to toggle favorite status'
  }
}