export default {
  title: 'My Drones',
  addDrone: 'Add Drone',
  editDrone: 'Edit Drone',
  newDrone: 'New Drone',
  noDrones: 'You don\'t have any registered drones yet',
  details: 'Details',
  location: 'Location',
  description: 'Description',
  visibility: 'Visibility',
  form: {
    name: 'Name',
    type: 'Select a style',
    brand: 'Select a brand',
    model: 'Model',
    serialNumber: 'Serial Number',
    weight: 'Weight (g)',
    frameSize: 'Frame Size (mm)',
    frame: 'Frame',
    description: 'Description',
    notes: 'Notes',
    image: 'Drone Image',
    droneImage: 'Drone Image',
    visibility: {
      followers: 'Visible to followers',
      public: 'Public'
    },
    components: 'Components',
    originType: 'Origin Type'
  },
  validation: {
    name: 'Name is required',
    type: 'Drone type is required',
    brand: 'Brand is required',
    model: 'Model is required',
    serialNumber: 'Serial number is required',
    weight: 'Weight is required',
    frameSize: 'Frame size is required'
  },
  delete: {
    title: 'Delete Drone',
    confirmation: 'Are you sure you want to delete the drone "{name}"? This action cannot be undone.'
  },
  specs: {
    weight: 'weight',
    frame: 'frame'
  }
}