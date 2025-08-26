## 📱 Frontend Integration Examples

### React Native / JavaScript Examples

#### 1. Send Friend Request
```javascript
const sendFriendRequest = async (recipientId) => {
  try {
    const response = await fetch('/api/friends/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ recipientId })
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('Friend request sent!', data.data);
    }
  } catch (error) {
    console.error('Error sending friend request:', error);
  }
};
```

#### 2. Accept Friend Request
```javascript
const acceptFriendRequest = async (friendshipId) => {
  try {
    const response = await fetch(`/api/friends/${friendshipId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ action: 'accept' })
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('Friend request accepted!', data.data.friend);
    }
  } catch (error) {
    console.error('Error accepting friend request:', error);
  }
};
```

#### 3. Search Users
```javascript
const searchUsers = async (query, limit = 10, offset = 0) => {
  try {
    const params = new URLSearchParams({
      query,
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    const response = await fetch(`/api/friends/search?${params}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    const data = await response.json();
    if (data.success) {
      return data.data.users;
    }
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};
```

#### 4. Get Friends List with Pagination
```javascript
const getFriends = async (limit = 20, offset = 0) => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });
    
    const response = await fetch(`/api/friends/list?${params}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    const data = await response.json();
    if (data.success) {
      return {
        friends: data.data.friends,
        hasMore: data.pagination.hasMore,
        totalCount: data.data.totalCount
      };
    }
  } catch (error) {
    console.error('Error getting friends:', error);
    return { friends: [], hasMore: false, totalCount: 0 };
  }
};
```

#### 5. Block User
```javascript
const blockUser = async (targetUserId) => {
  try {
    const response = await fetch(`/api/friends/block/${targetUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ action: 'block' })
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('User blocked successfully');
    }
  } catch (error) {
    console.error('Error blocking user:', error);
  }
};
```

---

## 🚨 Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "FRIENDSHIP_ALREADY_FRIENDS",
    "message": "You are already friends with this user",
    "statusCode": 409
  }
}
```

### Common Error Codes

#### Friend Request Errors
- `FRIENDSHIP_CANNOT_FRIEND_YOURSELF` (400) - Cannot send request to yourself
- `FRIENDSHIP_ALREADY_FRIENDS` (409) - Already friends
- `FRIENDSHIP_REQUEST_ALREADY_SENT` (409) - Request already sent
- `FRIENDSHIP_USER_BLOCKED` (403) - User is blocked
- `USER_NOT_FOUND` (404) - User doesn't exist

#### Friendship Management Errors
- `FRIENDSHIP_NOT_FOUND` (404) - Friendship doesn't exist
- `FRIENDSHIP_NOT_AUTHORIZED` (403) - Not authorized for this action
- `FRIENDSHIP_INVALID_STATUS_TRANSITION` (400) - Invalid action for current status

#### Validation Errors
- `VALIDATION_INVALID_INPUT` (400) - Invalid input data
- `VALIDATION_MISSING_FIELDS` (400) - Required fields missing

#### Authentication Errors
- `AUTH_TOKEN_MISSING` (401) - No authentication token
- `AUTH_TOKEN_INVALID` (401) - Invalid authentication token
- `AUTH_TOKEN_EXPIRED` (401) - Expired authentication token

---

## 🔄 Real-time Updates (WebSocket Integration)

For real-time friendship events, consider implementing WebSocket listeners for:

1. **Friend Request Received**: `friend_request_received`
2. **Friend Request Accepted**: `friend_request_accepted`
3. **Friend Status Change**: `friend_status_change`
4. **Friend Activity Update**: `friend_activity_update`

Example WebSocket event:
```json
{
  "event": "friend_request_received",
  "data": {
    "friendshipId": "123e4567-e89b-12d3-a456-426614174000",
    "from": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

---

## 🚀 Best Practices for Frontend Implementation

1. **Caching**: Cache friend lists and requests locally to reduce API calls
2. **Pagination**: Implement infinite scroll for large friend lists
3. **Debouncing**: Debounce search queries to avoid excessive API calls
4. **Optimistic Updates**: Update UI immediately, rollback on error
5. **Error Handling**: Always handle network errors gracefully
6. **Loading States**: Show loading indicators during API calls
7. **Pull to Refresh**: Implement pull-to-refresh for friend lists
8. **Offline Support**: Cache essential data for offline viewing

---

## 📊 Rate Limiting

Recommended rate limits (to be implemented at API gateway level):
- Search: 60 requests per minute
- Send Friend Request: 10 requests per minute  
- General endpoints: 100 requests per minute

---

This comprehensive API provides all the functionality needed for a robust friendship system in your mobile app. The frontend team can use these endpoints to build features like friend lists, user search, friend requests management, and social activity tracking.
