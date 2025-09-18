export default {
  title: 'Equipment',
  description: 'Manage your FPV equipment and tools',
  addItem: 'Add Equipment',
  editItem: 'Edit Equipment',
  noItems: 'No equipment registered',
  noItemsOfType: 'No equipment of this type',
  addFirst: 'Add {type}',
  addFirstDescription: 'Start by adding your first equipment to keep a complete record.',
  selectType: 'Select equipment type',
  addFavorite: 'Add to favorites',
  removeFavorite: 'Remove from favorites',
  favorite: 'Favorite',
  viewProduct: 'View product',
  itemDetails: 'Equipment details',
  confirmDelete: 'Confirm deletion',
  deleteWarning: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
  loginDescription: 'Log in to manage your FPV equipment and tools.',
  
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
    refurbished: 'Refurbished'
  },
  
  form: {
    name: 'Name',
    type: 'Type',
    brand: 'Brand',
    model: 'Model',
    brandModel: 'Brand and Model',
    condition: 'Condition',
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
    
    placeholders: {
      name: 'Ex: DJI FPV Drone',
      brand: 'Ex: DJI',
      model: 'Ex: FPV',
      price: '0.00',
      serialNumber: 'Ex: ABC123456',
      location: 'Ex: Toolbox, Shelf A',
      sourceUrl: 'https://...',
      description: 'Describe the main features...',
      notes: 'Additional notes, condition, observations...'
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