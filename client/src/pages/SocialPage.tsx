import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/lib/stores/useUser";
import { useSocial } from "@/lib/stores/useSocial";
import { toast } from "sonner";

const SocialPage = () => {
  const { userId, username } = useUser();
  const {
    friends,
    pendingFriends,
    studyGroups,
    challenges,
    fetchFriends,
    fetchPendingFriends,
    fetchStudyGroups,
    fetchChallenges,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    createStudyGroup,
    joinStudyGroupWithCode,
    createChallenge,
  } = useSocial();

  const [friendUsername, setFriendUsername] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newChallengeData, setNewChallengeData] = useState({
    friendId: "",
    title: "",
    description: "",
    type: "study_time",
    target: 60, // Default 60 minutes
    endDate: "",
  });

  useEffect(() => {
    if (userId) {
      fetchFriends(userId);
      fetchPendingFriends(userId);
      fetchStudyGroups(userId);
      fetchChallenges(userId);
    }
  }, [
    userId,
    fetchFriends,
    fetchPendingFriends,
    fetchStudyGroups,
    fetchChallenges,
  ]);

  const handleSendFriendRequest = async () => {
    if (!friendUsername.trim()) {
      toast.error("Please enter a username");
      return;
    }

    try {
      await sendFriendRequest(userId, friendUsername);
      toast.success(`Friend request sent to ${friendUsername}`);
      setFriendUsername("");
    } catch (error) {
      toast.error("Failed to send friend request");
    }
  };

  const handleCreateStudyGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    try {
      await createStudyGroup({
        name: newGroupName,
        description: newGroupDescription,
        ownerId: userId,
        isPrivate: false,
      });

      toast.success(`Study group "${newGroupName}" created`);
      setNewGroupName("");
      setNewGroupDescription("");
      fetchStudyGroups(userId);
    } catch (error) {
      toast.error("Failed to create study group");
    }
  };

  const handleJoinStudyGroup = async () => {
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }

    try {
      await joinStudyGroupWithCode(inviteCode, userId);
      toast.success("Successfully joined study group");
      setInviteCode("");
      fetchStudyGroups(userId);
    } catch (error) {
      toast.error("Failed to join study group");
    }
  };

  const handleCreateChallenge = async () => {
    if (
      !newChallengeData.friendId ||
      !newChallengeData.title ||
      !newChallengeData.endDate
    ) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      await createChallenge({
        ...newChallengeData,
        creatorId: userId,
      });

      toast.success("Challenge created successfully");
      setNewChallengeData({
        friendId: "",
        title: "",
        description: "",
        type: "study_time",
        target: 60,
        endDate: "",
      });
      fetchChallenges(userId);
    } catch (error) {
      toast.error("Failed to create challenge");
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6">Social Hub</h1>

        <Tabs defaultValue="friends">
          <TabsList className="mb-4">
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="studyGroups">Study Groups</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          {/* Friends Tab */}
          <TabsContent value="friends">
            <div className="space-y-6">
              {/* Add Friend */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Friend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter username"
                      value={friendUsername}
                      onChange={(e) => setFriendUsername(e.target.value)}
                    />
                    <Button onClick={handleSendFriendRequest}>
                      Send Request
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Friend Requests */}
              {pendingFriends.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Friend Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingFriends.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {request.username.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{request.username}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => acceptFriendRequest(request.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectFriendRequest(request.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Friends List */}
              <Card>
                <CardHeader>
                  <CardTitle>My Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  {friends.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No friends yet. Add friends to study together!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {friends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-card"
                        >
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${friend.username}`}
                            />
                            <AvatarFallback>
                              {friend.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{friend.username}</div>
                            <div className="text-sm text-muted-foreground">
                              Level {friend.level}
                            </div>
                          </div>
                          <div className="ml-auto flex space-x-2">
                            <Button size="sm" variant="outline">
                              Message
                            </Button>
                            <Button size="sm">Challenge</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Study Groups Tab */}
          <TabsContent value="studyGroups">
            <div className="space-y-6">
              {/* Create Study Group */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Study Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Group Name</label>
                      <Input
                        placeholder="Enter group name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Description</label>
                      <Input
                        placeholder="Enter description"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleCreateStudyGroup}>
                      Create Group
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Join Study Group */}
              <Card>
                <CardHeader>
                  <CardTitle>Join Study Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter invite code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                    />
                    <Button onClick={handleJoinStudyGroup}>Join Group</Button>
                  </div>
                </CardContent>
              </Card>

              {/* My Study Groups */}
              <Card>
                <CardHeader>
                  <CardTitle>My Study Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  {studyGroups.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No study groups yet. Create or join a group!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {studyGroups.map((group) => (
                        <div
                          key={group.id}
                          className="flex flex-col p-4 rounded-lg bg-card border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold">{group.name}</h3>
                            <Badge>{group.memberCount} members</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {group.description}
                          </p>
                          <div className="mt-auto flex space-x-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm">Study Together</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <div className="space-y-6">
              {/* Create Challenge */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Friend</label>
                      <select
                        className="w-full px-3 py-2 rounded-md border"
                        value={newChallengeData.friendId}
                        onChange={(e) =>
                          setNewChallengeData({
                            ...newChallengeData,
                            friendId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select a friend</option>
                        {friends.map((friend) => (
                          <option key={friend.id} value={friend.id}>
                            {friend.username}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Title</label>
                      <Input
                        placeholder="Challenge title"
                        value={newChallengeData.title}
                        onChange={(e) =>
                          setNewChallengeData({
                            ...newChallengeData,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Description</label>
                      <Input
                        placeholder="Challenge description"
                        value={newChallengeData.description}
                        onChange={(e) =>
                          setNewChallengeData({
                            ...newChallengeData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Type</label>
                      <select
                        className="w-full px-3 py-2 rounded-md border"
                        value={newChallengeData.type}
                        onChange={(e) =>
                          setNewChallengeData({
                            ...newChallengeData,
                            type: e.target.value,
                          })
                        }
                      >
                        <option value="study_time">Study Time</option>
                        <option value="xp_gain">XP Gain</option>
                        <option value="quest_completion">
                          Quest Completion
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Target (
                        {newChallengeData.type === "study_time"
                          ? "minutes"
                          : "amount"}
                        )
                      </label>
                      <Input
                        type="number"
                        placeholder="Target amount"
                        value={newChallengeData.target}
                        onChange={(e) =>
                          setNewChallengeData({
                            ...newChallengeData,
                            target: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">End Date</label>
                      <Input
                        type="date"
                        value={newChallengeData.endDate}
                        onChange={(e) =>
                          setNewChallengeData({
                            ...newChallengeData,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleCreateChallenge}>
                      Create Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Challenges */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  {challenges.filter((c) => c.status === "active").length ===
                  0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No active challenges. Create a challenge to compete with
                      friends!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {challenges
                        .filter((c) => c.status === "active")
                        .map((challenge) => (
                          <div
                            key={challenge.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold">{challenge.title}</h3>
                              <Badge
                                variant={
                                  challenge.type === "study_time"
                                    ? "default"
                                    : challenge.type === "xp_gain"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {challenge.type.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {challenge.description}
                            </p>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Your Progress:</span>
                                <span>
                                  {challenge.creatorId === userId
                                    ? challenge.creatorProgress
                                    : challenge.challengedProgress}{" "}
                                  / {challenge.target}
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{
                                    width: `${Math.min(
                                      ((challenge.creatorId === userId
                                        ? challenge.creatorProgress
                                        : challenge.challengedProgress) /
                                        challenge.target) *
                                        100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Opponent's Progress:</span>
                                <span>
                                  {challenge.creatorId !== userId
                                    ? challenge.creatorProgress
                                    : challenge.challengedProgress}{" "}
                                  / {challenge.target}
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-secondary"
                                  style={{
                                    width: `${Math.min(
                                      ((challenge.creatorId !== userId
                                        ? challenge.creatorProgress
                                        : challenge.challengedProgress) /
                                        challenge.target) *
                                        100,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Ends on{" "}
                              {new Date(challenge.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Completed Challenges */}
              {challenges.filter((c) => c.status === "completed").length >
                0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {challenges
                        .filter((c) => c.status === "completed")
                        .map((challenge) => (
                          <div
                            key={challenge.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-bold">{challenge.title}</h3>
                              <Badge variant="outline">
                                {challenge.winnerId === userId
                                  ? "You won!"
                                  : "You lost"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {challenge.description}
                            </p>
                            <div className="flex justify-between text-sm">
                              <span>Final score:</span>
                              <span>
                                {challenge.creatorId === userId
                                  ? `You: ${challenge.creatorProgress} | Opponent: ${challenge.challengedProgress}`
                                  : `You: ${challenge.challengedProgress} | Opponent: ${challenge.creatorProgress}`}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SocialPage;
