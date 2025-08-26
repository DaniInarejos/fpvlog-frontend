export default {
  title: 'Groups',
  topicsn: 'Topics',
  subtitle: 'Connect with other FPV pilots',
  createGroup: 'Create Group',
  editGroup: 'Edit Group',
  joinGroup: 'Join Group',
  leaveGroup: 'Leave Group',
  leave: 'Leave',
  requestJoin: 'Request to Join',
  notFound: 'Group not found',
  join: 'Join',
  private: 'Private',
  public: 'Public',
  deleteGroup: 'Delete Group',
  deleteConfirmation: 'Are you sure you want to delete the group "{name}"?',
  deleteWarning: 'This action cannot be undone. All topics, comments, and members will be deleted.',
  confirmDelete: 'Yes, Delete',
  joinAndComment: 'Join the group to participate in discussions and comment on topics',
  
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
  confirmRemoveMemberWarning: 'This action cannot be undone. The user will be removed from the group, and they will no longer have access to the group content.',
  confirmRemoveMemberSuccess: 'Member removed successfully',
  confirmRemoveMemberError: 'Failed to remove member',
  privateGroupMessage: 'This is a private group. Request to join to view the content.',

  topics: {
    title: 'Discussion Topics',
    createTopic: 'Create Topic',
    editTopic: 'Edit Topic',
    deleteTitle: 'Delete Topic',
    deleteConfirmation: 'Are you sure you want to delete the topic "{title}"?',
    postCount: '{count} posts',
    comments: 'Comments',
    noComments: 'No comments yet. Be the first to comment!',
    addComment: 'Add Comment',
    commentPlaceholder: 'Write your comment here...',
    postComment: 'Post Comment',
    createdBy: 'Created by',
    pinned: 'Pinned',
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
  comments: {
    placeholder: 'Write a comment...',
    post: 'Comment',
    reply: 'Reply',
    replyPlaceholder: 'Write a reply...',
    edited: 'edited',
    confirmDelete: 'Are you sure you want to delete this comment?',
    empty: 'No comments yet. Be the first to comment!',
    showReplies: 'Show {count} replies',
    addComment: 'Add Comment',
    writeComment: 'Write a comment...',
    comment: 'Comment'
  },
  detail: {
    view: 'View',
    tabs: {
      topics: 'Topics',
      posts: 'Posts',
      members: 'Members',
      about: 'About'
    }
  },
  about: {
    description: 'Description',
    details: 'Group Details',
    created: 'Created on {date}',
    privacy: 'Privacy'
  }
}