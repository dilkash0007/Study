import { create } from "zustand";
import axios from "axios";

export interface Friend {
  id: number;
  username: string;
  level: number;
  status: string;
}

export interface PendingFriend {
  id: number;
  username: string;
  status: string;
}

export interface StudyGroup {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  inviteCode: string;
  isPrivate: boolean;
  memberCount: number;
  createdAt: string;
}

export interface GroupMember {
  id: number;
  userId: number;
  groupId: number;
  username: string;
  role: string;
  joinedAt: string;
}

export interface Challenge {
  id: number;
  creatorId: number;
  challengedId: number;
  creatorName: string;
  challengedName: string;
  title: string;
  description: string;
  type: string;
  target: number;
  startDate: string;
  endDate: string;
  creatorProgress: number;
  challengedProgress: number;
  status: string;
  winnerId: number | null;
}

export interface GroupStudySession {
  id: number;
  groupId: number;
  creatorId: number;
  title: string;
  description: string;
  scheduledStart: string | null;
  scheduledEnd: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  status: string;
  createdAt: string;
  participants: number;
}

interface SocialState {
  friends: Friend[];
  pendingFriends: PendingFriend[];
  studyGroups: StudyGroup[];
  challenges: Challenge[];
  currentGroupMessages: any[];
  isLoading: boolean;
  error: string | null;

  // Friends actions
  fetchFriends: (userId: number) => Promise<void>;
  fetchPendingFriends: (userId: number) => Promise<void>;
  sendFriendRequest: (userId: number, friendUsername: string) => Promise<void>;
  acceptFriendRequest: (friendshipId: number) => Promise<void>;
  rejectFriendRequest: (friendshipId: number) => Promise<void>;
  removeFriend: (friendshipId: number) => Promise<void>;

  // Study Groups actions
  fetchStudyGroups: (userId: number) => Promise<void>;
  createStudyGroup: (groupData: {
    name: string;
    description: string;
    ownerId: number;
    isPrivate: boolean;
  }) => Promise<void>;
  joinStudyGroupWithCode: (inviteCode: string, userId: number) => Promise<void>;
  leaveStudyGroup: (groupId: number, userId: number) => Promise<void>;
  fetchGroupMembers: (groupId: number) => Promise<GroupMember[]>;

  // Group Messages actions
  fetchGroupMessages: (groupId: number) => Promise<void>;
  sendGroupMessage: (
    groupId: number,
    userId: number,
    message: string
  ) => Promise<void>;

  // Study Sessions actions
  fetchGroupStudySessions: (
    groupId: number,
    status?: string
  ) => Promise<GroupStudySession[]>;
  createGroupStudySession: (sessionData: any) => Promise<void>;
  joinStudySession: (sessionId: number, userId: number) => Promise<void>;
  startStudySession: (sessionId: number, userId: number) => Promise<void>;
  endStudySession: (sessionId: number, userId: number) => Promise<void>;

  // Challenges actions
  fetchChallenges: (userId: number) => Promise<void>;
  createChallenge: (challengeData: any) => Promise<void>;
  updateChallengeProgress: (
    challengeId: number,
    userId: number,
    progress: number
  ) => Promise<void>;
}

export const useSocial = create<SocialState>((set, get) => ({
  friends: [],
  pendingFriends: [],
  studyGroups: [],
  challenges: [],
  currentGroupMessages: [],
  isLoading: false,
  error: null,

  // Friends actions
  fetchFriends: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `/api/social/users/${userId}/friends?status=accepted`
      );
      set({ friends: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching friends:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch friends",
        isLoading: false,
      });
    }
  },

  fetchPendingFriends: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `/api/social/users/${userId}/friends?status=pending`
      );
      set({ pendingFriends: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching pending friends:", error);
      set({
        error:
          error.response?.data?.message || "Failed to fetch pending friends",
        isLoading: false,
      });
    }
  },

  sendFriendRequest: async (userId, friendUsername) => {
    set({ isLoading: true });
    try {
      // First find the friend's ID by username
      const userResponse = await axios.get(
        `/api/users/by-username/${friendUsername}`
      );
      const friendId = userResponse.data.id;

      // Send the friend request
      await axios.post(`/api/social/friends/request`, { userId, friendId });

      set({ isLoading: false });
    } catch (error) {
      console.error("Error sending friend request:", error);
      set({
        error: error.response?.data?.message || "Failed to send friend request",
        isLoading: false,
      });
      throw error;
    }
  },

  acceptFriendRequest: async (friendshipId) => {
    set({ isLoading: true });
    try {
      await axios.put(`/api/social/friends/respond`, {
        friendshipId,
        status: "accepted",
      });

      // Update friends and pending friends lists
      const userId = get().pendingFriends.find(
        (f) => f.id === friendshipId
      )?.userId;
      if (userId) {
        await get().fetchFriends(userId);
        await get().fetchPendingFriends(userId);
      }

      set({ isLoading: false });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      set({
        error:
          error.response?.data?.message || "Failed to accept friend request",
        isLoading: false,
      });
    }
  },

  rejectFriendRequest: async (friendshipId) => {
    set({ isLoading: true });
    try {
      await axios.put(`/api/social/friends/respond`, {
        friendshipId,
        status: "rejected",
      });

      // Update pending friends list
      const { pendingFriends } = get();
      set({
        pendingFriends: pendingFriends.filter((f) => f.id !== friendshipId),
        isLoading: false,
      });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      set({
        error:
          error.response?.data?.message || "Failed to reject friend request",
        isLoading: false,
      });
    }
  },

  removeFriend: async (friendshipId) => {
    set({ isLoading: true });
    try {
      await axios.delete(`/api/social/friends/${friendshipId}`);

      // Update friends list
      const { friends } = get();
      set({
        friends: friends.filter((f) => f.id !== friendshipId),
        isLoading: false,
      });
    } catch (error) {
      console.error("Error removing friend:", error);
      set({
        error: error.response?.data?.message || "Failed to remove friend",
        isLoading: false,
      });
    }
  },

  // Study Groups actions
  fetchStudyGroups: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/api/social/users/${userId}/groups`);
      set({ studyGroups: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching study groups:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch study groups",
        isLoading: false,
      });
    }
  },

  createStudyGroup: async (groupData) => {
    set({ isLoading: true });
    try {
      await axios.post(`/api/social/groups`, groupData);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error creating study group:", error);
      set({
        error: error.response?.data?.message || "Failed to create study group",
        isLoading: false,
      });
      throw error;
    }
  },

  joinStudyGroupWithCode: async (inviteCode, userId) => {
    set({ isLoading: true });
    try {
      await axios.post(`/api/social/groups/join`, { inviteCode, userId });
      set({ isLoading: false });
    } catch (error) {
      console.error("Error joining study group:", error);
      set({
        error: error.response?.data?.message || "Failed to join study group",
        isLoading: false,
      });
      throw error;
    }
  },

  leaveStudyGroup: async (groupId, userId) => {
    set({ isLoading: true });
    try {
      await axios.delete(`/api/social/groups/${groupId}/members/${userId}`);

      // Update study groups list
      const { studyGroups } = get();
      set({
        studyGroups: studyGroups.filter((g) => g.id !== groupId),
        isLoading: false,
      });
    } catch (error) {
      console.error("Error leaving study group:", error);
      set({
        error: error.response?.data?.message || "Failed to leave study group",
        isLoading: false,
      });
    }
  },

  fetchGroupMembers: async (groupId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/api/social/groups/${groupId}`);
      set({ isLoading: false });
      return response.data.members;
    } catch (error) {
      console.error("Error fetching group members:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch group members",
        isLoading: false,
      });
      return [];
    }
  },

  // Group Messages actions
  fetchGroupMessages: async (groupId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `/api/social/groups/${groupId}/messages`
      );
      set({ currentGroupMessages: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching group messages:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch messages",
        isLoading: false,
      });
    }
  },

  sendGroupMessage: async (groupId, userId, message) => {
    try {
      const response = await axios.post(
        `/api/social/groups/${groupId}/messages`,
        {
          userId,
          message,
        }
      );

      // Add the new message to the current messages
      const { currentGroupMessages } = get();
      set({
        currentGroupMessages: [...currentGroupMessages, response.data],
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Study Sessions actions
  fetchGroupStudySessions: async (groupId, status) => {
    set({ isLoading: true });
    try {
      const url = status
        ? `/api/social/groups/${groupId}/sessions?status=${status}`
        : `/api/social/groups/${groupId}/sessions`;

      const response = await axios.get(url);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      set({
        error:
          error.response?.data?.message || "Failed to fetch study sessions",
        isLoading: false,
      });
      return [];
    }
  },

  createGroupStudySession: async (sessionData) => {
    set({ isLoading: true });
    try {
      await axios.post(
        `/api/social/groups/${sessionData.groupId}/sessions`,
        sessionData
      );
      set({ isLoading: false });
    } catch (error) {
      console.error("Error creating study session:", error);
      set({
        error:
          error.response?.data?.message || "Failed to create study session",
        isLoading: false,
      });
      throw error;
    }
  },

  joinStudySession: async (sessionId, userId) => {
    try {
      await axios.post(`/api/social/sessions/${sessionId}/join`, { userId });
    } catch (error) {
      console.error("Error joining study session:", error);
      throw error;
    }
  },

  startStudySession: async (sessionId, userId) => {
    try {
      await axios.put(`/api/social/sessions/${sessionId}/start`, { userId });
    } catch (error) {
      console.error("Error starting study session:", error);
      throw error;
    }
  },

  endStudySession: async (sessionId, userId) => {
    try {
      await axios.put(`/api/social/sessions/${sessionId}/end`, { userId });
    } catch (error) {
      console.error("Error ending study session:", error);
      throw error;
    }
  },

  // Challenges actions
  fetchChallenges: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `/api/social/users/${userId}/challenges`
      );
      set({ challenges: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching challenges:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch challenges",
        isLoading: false,
      });
    }
  },

  createChallenge: async (challengeData) => {
    set({ isLoading: true });
    try {
      await axios.post(`/api/social/challenges`, challengeData);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error creating challenge:", error);
      set({
        error: error.response?.data?.message || "Failed to create challenge",
        isLoading: false,
      });
      throw error;
    }
  },

  updateChallengeProgress: async (challengeId, userId, progress) => {
    try {
      const response = await axios.put(
        `/api/social/challenges/${challengeId}/progress`,
        {
          userId,
          progress,
        }
      );

      // Update the challenge in the challenges list
      const { challenges } = get();
      const updatedChallenges = challenges.map((c) =>
        c.id === challengeId ? response.data : c
      );

      set({ challenges: updatedChallenges });
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      throw error;
    }
  },
}));
