export default {
  message: {
    nav: {
      home: 'Home',
      flights: 'Flights',
      drones: 'Drones',
      profile: 'Profile',
      dashboard: 'Dashboard',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      about: 'About',
      myData: 'My Data',
      droneBrands: 'Drone Brands',
      droneTypes: 'Drone Types',
      followers: 'Followers',
      following: 'Following',
      feed: 'Feed',
      components: 'Components',
      spots: 'Spots'
    },
    common: {
      loading: 'Loading...',
      error: 'An error has occurred',
      success: 'Operation successful',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      select: 'Select',
      likes:"Likes"
    },
    about: {
      title: 'About SkySphere',
      description: 'SkySphere is a personal project specifically designed for the FPV drone pilot community. The platform provides all the necessary tools to document, manage and share your flight experiences, it is in continuous development and new features will be added.',
      mainFeatures: 'Main Features',
      features: {
        flights: 'Detailed flight logging with location and condition information',
        drones: 'Complete management of your drone fleet',
        community: 'Active FPV pilot community',
        share: 'Share experiences and learn from other pilots',
        interface: 'Intuitive and modern interface'
      },
      technologies: 'Technologies Used',
      techs: {
        vue: 'Vue.js 3 with Composition API',
        tailwind: 'Tailwind CSS',
        vite: 'Vite',
        claude: 'Claude-3.5 AI',
        backend: 'Bunjs + hono Backend',
        database: 'MongoDB Atlas + Redis Upstash'
      },
      performanceNote: 'The project is deployed on free tiers. If you experience any response delay, this may be due to the backend initializing a new instance.',
      developer: {
        title: 'About the Developer',
        name: 'Daniel Inarejos Aroca',
        nickname: 'although my friends call me Danico',
        description: 'I am a software developer with over 12 years of experience and FPV drone enthusiast. I created SkySphere to solve the need for a modern and complete platform for the FPV pilot community.',
        motivation: 'As an FPV pilot, I understand the specific needs of our community and constantly work to improve this platform with new features and enhancements.',
        contact: 'Contact and Social Media'
      }
    },
    drones: {
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
        components:'Components',
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
      },

    },
    flights: {
      title: 'My Flights',
      addFlight: 'Add Flight',
      editFlight: 'Edit Flight',
      newFlight: 'New Flight',
      noFlights: 'You don\'t have any registered flights yet',
      form: {
        title: 'Title',
        date: 'Date',
        drone: 'Select a drone',
        location: 'Location',
        duration: 'Duration (seconds)',
        batteryUsed: 'Batteries Used',
        weather: 'Weather',
        notes: 'Notes',
        image: 'Flight Image',
        visibility: {
          followers: 'Visible to followers',
          public: 'Public'
        }
      },
      validation: {
        title: 'Title is required',
        date: 'Date is required',
        location: 'Location is required',
        duration: 'Duration is required',
        batteryUsed: 'Number of batteries is required',
        droneId: 'Drone is required',
        image: 'Error uploading flight image'
      },
      details: {
        drone: 'Drone',
        date: 'Date',
        batteryUsed: 'Baterry used',
        likes: "Likes",
        weather: "Weather",
        notes: 'Notes',
        visibility: 'Visibility',
        location: 'Location',
        duration: 'duration',
        batteries: 'batteries',
        notSpecified: 'Not specified',
        viewDrone: 'View drone details'
      },
      delete: {
        title: 'Delete Flight',
        confirmation: 'Are you sure you want to delete the flight "{title}"? This action cannot be undone.'
      }
    },
    followers: {
      title: 'Followers',
      total: 'Total',
      searchPlaceholder: 'Search by username...',
      noUsersFound: 'No users found',
      noFollowers: 'You don\'t have any followers yet',
      followsSince: 'Follows you since',
      error: {
        loading: 'Error loading followers',
        userNotFound: 'User not found'
      }
    },
    following: {
      title: 'Following',
      searchPlaceholder: 'Search by username...',
      noUsersFound: 'No users found',
      noFollowing: 'You are not following any users yet',
      unfollowButton: 'Unfollow',
      followedSince: 'Followed since',
      error: {
        loading: 'Error loading followed users',
        unfollow: 'Error unfollowing user',
        userNotFound: 'User not found'
      }
    },
    dashboard: {
      error: {
        loading: 'Error loading dashboard',
        userNotFound: 'User not found',
        followError: 'Error following user',
        unfollowError: 'Error unfollowing user'
      },
      stats: {
        drones: 'Drones',
        flights: 'Flights',
        followers: 'Followers',
        following: 'Following',
        feed: 'Feed'
      },
      recentFlights: {
        title: 'Flights',
        noFlights: 'No recent flights',
        duration: 'min',
        location: 'Location'
      },
      drones: {
        title: 'Drones',
        noDrones: 'No registered drones'
      },
      follow: {
        follow: 'Follow',
        unfollow: 'Unfollow'
      }
    },
    home: {
      error: {
        loading: 'Error loading profile data'
      },
      profile: {
        bio: 'FPV pilot passionate about drones',
        followers: 'Followers',
        following: 'Following',
        feed: 'Feed'
      },
      stats: {
        totalTime: 'Total Time',
        flights: 'Flights',
        drones: 'Drones',
        averageTime: 'Average Time'
      },
      sections: {
        myDrones: 'My Drones',
        recentFlights: 'My Flights'
      },
      time: {
        hours: 'h',
        minutes: 'm'
      }
    },
    feed: {
      drone:{title:'Drone'},
      description: 'Description',
      title: 'Global Feed',
      subtitle: 'Discover the latest drones, flights and users from the community',
      error: {
        loading: 'Error loading feed'
      },
      noMoreContent: 'No more content to show',
      itemInfo: {
        location: 'Location',
        duration: 'Duration',
        weather: 'Weather',
        weight: 'Weight',
        type: 'Type',
        model:"Model",
        frameSize:"Frame size",
        brand: 'Brand',
        newUser: 'New user',
        joinedAt: 'Joined on',
        likes: 'Likes',
        noLikes: 'Without likes'
      }
    },
    profile: {
      title: 'My Profile',
      uploadPhoto: 'Change photo',
      stats: {
        flights: 'Flights',
        followers: 'Followers',
        following: 'Following'
      },
      form: {
        username: 'Username',
        name: 'Name',
        lastName: 'Last Name',
        email: 'Email',
        saveChanges: 'Save Changes'
      },
      privacy: {
        title: 'Privacy',
        allowFlights: 'Allow followers to see my flights',
        allowDrones: 'Allow followers to see my drones',
        profileVisibility: 'Profile visibility',
        
        allowDrones: 'Allow followers to see my drones',
        profileVisibility: 'Profile visibility',
        options: {
          public: 'Public',
          followers: 'Followers only',
          private: 'Private'
        }
      },
      messages: {
        updateSuccess: 'Profile updated successfully',
        updateError: 'Error updating profile',
        loadError: 'Error loading profile',
        photoError: 'Error uploading profile picture'
      }
    },
    components: {
         title: 'Components for drones',
      addComponent: 'add Component',
      noComponents: 'Dont have component type',
      addFirst: 'Añadir {type}',
      form: {
        name: 'Nombre',
        brand: 'Brand',
        weight: 'Weight (g)',
        sourceUrl: 'Buy URL',
        description: 'Descripción'
      },
          types: {
            frame: 'Frame',
            motor: 'Motor',
            flightController: 'Flight Controller',
            esc: 'ESC',
            vtx: 'VTX',
            camera: 'Camera',
            antenna: 'Antenna',
            receiver: 'Receiver',
            battery: 'Battery',
            props: 'Props',
            mount: 'Mount',
            other: 'Other'
          },
          validation: {
            required: 'This component is required',
            invalid: 'Invalid component'
          },
          select: {
            placeholder: 'Select component'
          }
        },
    spots: {
          title: 'My Spots',
          addSpot: 'Add Spot',
          editSpot: 'Edit Spot',
          createSpot: 'Create Spot',
          deleteSpot: 'Delete Spot',
          noSpots: 'You don\'t have any spots registered yet',
          deleteConfirmation: 'Are you sure you want to delete the spot "{name}"? This action cannot be undone.',
          public: 'Public',
          followersOnly: 'Followers only',
          private: 'Private',
          details: 'Details',
          location: 'Location',
          description: 'Description',
          visibility: 'Visibility',
          form: {
            name: 'Name',
            description: 'Description',
            location: 'Location',
            searchLocation: 'Search location...',
            visibility: 'Visibility',
            public: 'Public',
            visibleToFollowersOnly: 'Visible to followers only',
            create: 'Create Spot'
          },
          delete: {
            title: 'Delete Spot',
            confirmation: 'Are you sure you want to delete the spot "{name}"? This action cannot be undone.',
            success: 'Spot deleted successfully',
            error: 'Error deleting spot'
          }
        }
      }
    }
