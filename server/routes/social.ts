import express, { Request, Response } from "express";
import { storage } from "../storage";
import { generateRandomString } from "../utils";

const router = express.Router();

// Helper function to handle async routes
const asyncHandler = (fn: Function) => (req: Request, res: Response) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  });
};

// FRIENDSHIP ROUTES
// Send friend request
router.post(
  "/friends/request",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, friendId } = req.body;

    if (!userId || !friendId) {
      return res
        .status(400)
        .json({ message: "User ID and friend ID are required" });
    }

    try {
      // Check if users exist
      const user = await storage.getUserById(parseInt(userId));
      const friend = await storage.getUserById(parseInt(friendId));

      if (!user || !friend) {
        return res.status(404).json({ message: "User or friend not found" });
      }

      // Check if friendship already exists
      const existingFriendship = await storage.getFriendshipStatus(
        parseInt(userId),
        parseInt(friendId)
      );

      if (existingFriendship) {
        return res.status(409).json({
          message: "Friendship request already exists",
          status: existingFriendship.status,
        });
      }

      // Create friendship request
      const friendship = await storage.createFriendship({
        userId: parseInt(userId),
        friendId: parseInt(friendId),
        status: "pending",
      });

      res.status(201).json(friendship);
    } catch (error) {
      console.error("Send friend request error:", error);
      res.status(500).json({ message: "Failed to send friend request" });
    }
  })
);

// Accept/reject friend request
router.put(
  "/friends/respond",
  asyncHandler(async (req: Request, res: Response) => {
    const { friendshipId, status } = req.body;

    if (!friendshipId || !status) {
      return res
        .status(400)
        .json({ message: "Friendship ID and status are required" });
    }

    if (status !== "accepted" && status !== "rejected") {
      return res
        .status(400)
        .json({ message: "Status must be 'accepted' or 'rejected'" });
    }

    try {
      const friendship = await storage.updateFriendshipStatus(
        parseInt(friendshipId),
        status
      );

      if (!friendship) {
        return res
          .status(404)
          .json({ message: "Friendship request not found" });
      }

      res.status(200).json(friendship);
    } catch (error) {
      console.error("Respond to friend request error:", error);
      res.status(500).json({ message: "Failed to respond to friend request" });
    }
  })
);

// Get user's friends
router.get(
  "/users/:userId/friends",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status } = req.query;

    try {
      const friends = await storage.getUserFriends(
        parseInt(userId),
        status as string
      );
      res.status(200).json(friends);
    } catch (error) {
      console.error("Get friends error:", error);
      res.status(500).json({ message: "Failed to get friends" });
    }
  })
);

// Remove friend
router.delete(
  "/friends/:friendshipId",
  asyncHandler(async (req: Request, res: Response) => {
    const { friendshipId } = req.params;

    try {
      await storage.deleteFriendship(parseInt(friendshipId));
      res.status(204).send();
    } catch (error) {
      console.error("Remove friend error:", error);
      res.status(500).json({ message: "Failed to remove friend" });
    }
  })
);

// STUDY GROUP ROUTES
// Create study group
router.post(
  "/groups",
  asyncHandler(async (req: Request, res: Response) => {
    const { name, description, ownerId, isPrivate } = req.body;

    if (!name || !ownerId) {
      return res
        .status(400)
        .json({ message: "Name and owner ID are required" });
    }

    try {
      // Generate a unique invite code
      const inviteCode = generateRandomString(8);

      const studyGroup = await storage.createStudyGroup({
        name,
        description: description || "",
        ownerId: parseInt(ownerId),
        inviteCode,
        isPrivate: isPrivate || false,
      });

      // Add owner as a member with role="owner"
      await storage.addGroupMember({
        groupId: studyGroup.id,
        userId: parseInt(ownerId),
        role: "owner",
      });

      res.status(201).json(studyGroup);
    } catch (error) {
      console.error("Create study group error:", error);
      res.status(500).json({ message: "Failed to create study group" });
    }
  })
);

// Get user's study groups
router.get(
  "/users/:userId/groups",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const groups = await storage.getUserStudyGroups(parseInt(userId));
      res.status(200).json(groups);
    } catch (error) {
      console.error("Get study groups error:", error);
      res.status(500).json({ message: "Failed to get study groups" });
    }
  })
);

// Get study group details
router.get(
  "/groups/:groupId",
  asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;

    try {
      const group = await storage.getStudyGroupById(parseInt(groupId));

      if (!group) {
        return res.status(404).json({ message: "Study group not found" });
      }

      // Get group members
      const members = await storage.getGroupMembers(parseInt(groupId));

      res.status(200).json({
        ...group,
        members,
      });
    } catch (error) {
      console.error("Get study group details error:", error);
      res.status(500).json({ message: "Failed to get study group details" });
    }
  })
);

// Join study group with invite code
router.post(
  "/groups/join",
  asyncHandler(async (req: Request, res: Response) => {
    const { inviteCode, userId } = req.body;

    if (!inviteCode || !userId) {
      return res
        .status(400)
        .json({ message: "Invite code and user ID are required" });
    }

    try {
      // Find group by invite code
      const group = await storage.getStudyGroupByInviteCode(inviteCode);

      if (!group) {
        return res.status(404).json({ message: "Invalid invite code" });
      }

      // Check if user is already a member
      const isMember = await storage.isGroupMember(group.id, parseInt(userId));

      if (isMember) {
        return res
          .status(409)
          .json({ message: "User is already a member of this group" });
      }

      // Add user as member
      await storage.addGroupMember({
        groupId: group.id,
        userId: parseInt(userId),
        role: "member",
      });

      res.status(200).json(group);
    } catch (error) {
      console.error("Join study group error:", error);
      res.status(500).json({ message: "Failed to join study group" });
    }
  })
);

// Leave study group
router.delete(
  "/groups/:groupId/members/:userId",
  asyncHandler(async (req: Request, res: Response) => {
    const { groupId, userId } = req.params;

    try {
      await storage.removeGroupMember(parseInt(groupId), parseInt(userId));
      res.status(204).send();
    } catch (error) {
      console.error("Leave study group error:", error);
      res.status(500).json({ message: "Failed to leave study group" });
    }
  })
);

// STUDY GROUP MESSAGES
// Send message to group
router.post(
  "/groups/:groupId/messages",
  asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ message: "User ID and message are required" });
    }

    try {
      // Check if user is a member of the group
      const isMember = await storage.isGroupMember(
        parseInt(groupId),
        parseInt(userId)
      );

      if (!isMember) {
        return res
          .status(403)
          .json({ message: "User is not a member of this group" });
      }

      const groupMessage = await storage.createGroupMessage({
        groupId: parseInt(groupId),
        userId: parseInt(userId),
        message,
      });

      res.status(201).json(groupMessage);
    } catch (error) {
      console.error("Send group message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  })
);

// Get group messages
router.get(
  "/groups/:groupId/messages",
  asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    try {
      const messages = await storage.getGroupMessages(
        parseInt(groupId),
        limit,
        offset
      );
      res.status(200).json(messages);
    } catch (error) {
      console.error("Get group messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  })
);

// GROUP STUDY SESSIONS
// Create a group study session
router.post(
  "/groups/:groupId/sessions",
  asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { creatorId, title, description, scheduledStart, scheduledEnd } =
      req.body;

    if (!creatorId || !title) {
      return res
        .status(400)
        .json({ message: "Creator ID and title are required" });
    }

    try {
      // Check if user is a member of the group
      const isMember = await storage.isGroupMember(
        parseInt(groupId),
        parseInt(creatorId)
      );

      if (!isMember) {
        return res
          .status(403)
          .json({ message: "User is not a member of this group" });
      }

      const session = await storage.createGroupStudySession({
        groupId: parseInt(groupId),
        creatorId: parseInt(creatorId),
        title,
        description: description || "",
        scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
        scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
      });

      // Add creator as a participant
      await storage.addSessionParticipant({
        sessionId: session.id,
        userId: parseInt(creatorId),
      });

      res.status(201).json(session);
    } catch (error) {
      console.error("Create group study session error:", error);
      res.status(500).json({ message: "Failed to create study session" });
    }
  })
);

// Get group's study sessions
router.get(
  "/groups/:groupId/sessions",
  asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { status } = req.query;

    try {
      const sessions = await storage.getGroupStudySessions(
        parseInt(groupId),
        status as string
      );
      res.status(200).json(sessions);
    } catch (error) {
      console.error("Get group study sessions error:", error);
      res.status(500).json({ message: "Failed to get study sessions" });
    }
  })
);

// Join a study session
router.post(
  "/sessions/:sessionId/join",
  asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      // Get the session
      const session = await storage.getGroupStudySessionById(
        parseInt(sessionId)
      );

      if (!session) {
        return res.status(404).json({ message: "Study session not found" });
      }

      // Check if user is a member of the group
      const isMember = await storage.isGroupMember(
        session.groupId,
        parseInt(userId)
      );

      if (!isMember) {
        return res
          .status(403)
          .json({ message: "User is not a member of this group" });
      }

      // Add participant
      const participant = await storage.addSessionParticipant({
        sessionId: parseInt(sessionId),
        userId: parseInt(userId),
      });

      res.status(200).json(participant);
    } catch (error) {
      console.error("Join study session error:", error);
      res.status(500).json({ message: "Failed to join study session" });
    }
  })
);

// Start a study session
router.put(
  "/sessions/:sessionId/start",
  asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      // Get the session
      const session = await storage.getGroupStudySessionById(
        parseInt(sessionId)
      );

      if (!session) {
        return res.status(404).json({ message: "Study session not found" });
      }

      // Check if user is the creator
      if (session.creatorId !== parseInt(userId)) {
        return res
          .status(403)
          .json({ message: "Only the creator can start the session" });
      }

      // Start the session
      const updatedSession = await storage.startGroupStudySession(
        parseInt(sessionId)
      );

      res.status(200).json(updatedSession);
    } catch (error) {
      console.error("Start study session error:", error);
      res.status(500).json({ message: "Failed to start study session" });
    }
  })
);

// End a study session
router.put(
  "/sessions/:sessionId/end",
  asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      // Get the session
      const session = await storage.getGroupStudySessionById(
        parseInt(sessionId)
      );

      if (!session) {
        return res.status(404).json({ message: "Study session not found" });
      }

      // Check if user is the creator
      if (session.creatorId !== parseInt(userId)) {
        return res
          .status(403)
          .json({ message: "Only the creator can end the session" });
      }

      // End the session
      const updatedSession = await storage.endGroupStudySession(
        parseInt(sessionId)
      );

      res.status(200).json(updatedSession);
    } catch (error) {
      console.error("End study session error:", error);
      res.status(500).json({ message: "Failed to end study session" });
    }
  })
);

// CHALLENGES
// Create a challenge
router.post(
  "/challenges",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      creatorId,
      challengedId,
      title,
      description,
      type,
      target,
      endDate,
    } = req.body;

    if (!creatorId || !challengedId || !title || !type || !target || !endDate) {
      return res.status(400).json({
        message:
          "Creator ID, challenged ID, title, type, target, and end date are required",
      });
    }

    try {
      // Check if users are friends
      const areFriends = await storage.areFriends(
        parseInt(creatorId),
        parseInt(challengedId)
      );

      if (!areFriends) {
        return res
          .status(403)
          .json({ message: "Users must be friends to challenge each other" });
      }

      const challenge = await storage.createChallenge({
        creatorId: parseInt(creatorId),
        challengedId: parseInt(challengedId),
        title,
        description: description || "",
        type,
        target: parseInt(target),
        endDate: new Date(endDate),
      });

      res.status(201).json(challenge);
    } catch (error) {
      console.error("Create challenge error:", error);
      res.status(500).json({ message: "Failed to create challenge" });
    }
  })
);

// Get user's challenges
router.get(
  "/users/:userId/challenges",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status } = req.query;

    try {
      const challenges = await storage.getUserChallenges(
        parseInt(userId),
        status as string
      );
      res.status(200).json(challenges);
    } catch (error) {
      console.error("Get user challenges error:", error);
      res.status(500).json({ message: "Failed to get challenges" });
    }
  })
);

// Update challenge progress
router.put(
  "/challenges/:challengeId/progress",
  asyncHandler(async (req: Request, res: Response) => {
    const { challengeId } = req.params;
    const { userId, progress } = req.body;

    if (!userId || progress === undefined) {
      return res
        .status(400)
        .json({ message: "User ID and progress are required" });
    }

    try {
      const challenge = await storage.getChallengeById(parseInt(challengeId));

      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }

      // Check if user is part of the challenge
      if (
        challenge.creatorId !== parseInt(userId) &&
        challenge.challengedId !== parseInt(userId)
      ) {
        return res
          .status(403)
          .json({ message: "User is not part of this challenge" });
      }

      // Update progress based on user role
      const isCreator = challenge.creatorId === parseInt(userId);
      const updatedChallenge = await storage.updateChallengeProgress(
        parseInt(challengeId),
        isCreator ? "creator" : "challenged",
        parseInt(progress)
      );

      // Check if challenge is completed
      const completedChallenge = await storage.checkChallengeCompletion(
        parseInt(challengeId)
      );

      res.status(200).json(completedChallenge || updatedChallenge);
    } catch (error) {
      console.error("Update challenge progress error:", error);
      res.status(500).json({ message: "Failed to update challenge progress" });
    }
  })
);

export default router;
