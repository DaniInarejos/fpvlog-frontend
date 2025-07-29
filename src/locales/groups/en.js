export default {
  title: 'Groups',
  topicsn: 'Topics',
  subtitle: 'Connect with other FPV pilots',
  createGroup: 'Create Group',
  editGroup: 'Edit Group',
  joinGroup: 'Join Group',
  leaveGroup: 'Leave Group',
  requestJoin: 'Request to Join',
  private: 'Private',
  public: 'Public',
  
  tabs: {
    all: 'All',
    myGroups: 'My Groups',
    joined: 'Joined',
    public: 'Public',
    private: 'Private'
  },
  
  search: {
    placeholder: 'Search groups...'
  },
  
  form: {
    name: 'Group Name',
    namePlaceholder: 'Enter group name',
    description: 'Description',
    descriptionPlaceholder: 'Describe what your group is about',
    isPrivate: 'Private Group',
    isPrivateDescription: 'Private groups require approval to join',
    tags: 'Tags',
    tagsPlaceholder: 'Add tag',
    addTag: 'Add',
    tagsHelp: '{count} of {max} tags'
  },
  
  validation: {
    nameRequired: 'Group name is required',
    nameTooLong: 'Name cannot exceed 100 characters',
    descriptionRequired: 'Description is required',
    descriptionTooLong: 'Description cannot exceed 500 characters',
    tooManyTags: 'Maximum 10 tags allowed'
  },
  
  messages: {
    created: 'Group created successfully',
    updated: 'Group updated successfully',
    deleted: 'Group deleted successfully',
    joined: 'You have joined the group',
    left: 'You have left the group',
    requestSent: 'Request sent, awaiting approval'
  },
  
  delete: {
    confirmation: 'Are you sure you want to delete the group "{name}"?'
  },
  
  empty: {
    title: 'No groups found',
    description: 'Be the first to create a group to connect with other pilots'
  },
  
  memberCount: '{count} member | {count} members',
  createdBy: 'Created by {owner}',
  joinedOn: 'Joined on {date}',
  members: 'Members',
  noMembers: 'No members in this group',
  tags: 'Tags',
  
  roles: {
    owner: 'Owner',
    admin: 'Administrator',
    member: 'Member',
    pending: 'Pending',
    banned: 'Banned'
  },
  noPosts: 'No posts yet',
  noPostsDescription: 'Be the first to share something in this group.',
  writeComment: 'Write a comment...',
  comment: 'Comment',
  members: 'Members',
  inviteMembers: 'Invite Members',
  admin: 'Admin',
  moderator: 'Moderator',
  member: 'Member',
  joinedOn: 'Joined on',
  removeMember: 'Remove member',
  noMembers: 'No members in this group',
  joinRequests: 'Join Requests',
  requestedOn: 'Requested on',
  approve: 'Approve',
  reject: 'Reject',
  usernameOrEmail: 'Username or Email',
  enterUsernameOrEmail: 'Enter a username or email',
  sendInvite: 'Send Invite',
  confirmRemoveMember: 'Are you sure you want to remove {username} from the group?',
  topics: {
    title: 'Discussion Topics',
    createTopic: 'Create Topic',
    editTopic: 'Edit Topic',
    postCount: '{count} posts',
    empty: {
      title: 'No topics yet',
      description: 'Be the first to create a discussion topic for this group.'
    },
    form: {
      title: 'Title',
      titlePlaceholder: 'Enter topic title...',
      description: 'Description',
      descriptionPlaceholder: 'Describe what this topic is about...',
      pinTopic: 'Pin this topic'
    }
  },
  detail: {
    view: 'View',
    tabs: {
      topics: 'Topics',
      posts: 'Posts',
      members: 'Members',
      about: 'About'
    }
  }
}