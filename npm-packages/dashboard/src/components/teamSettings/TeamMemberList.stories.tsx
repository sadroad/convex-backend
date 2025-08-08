import { Meta, StoryObj } from "@storybook/nextjs";
import { InvitationResponse, Team, TeamMemberResponse } from "generatedApi";

import { TeamMemberList } from "./TeamMemberList";

const meta = { component: TeamMemberList } satisfies Meta<
  typeof TeamMemberList
>;

export default meta;
type Story = StoryObj<typeof meta>;

const members: TeamMemberResponse[] = [
  {
    id: 1,
    email: "user1@example.org",
    name: "User 1",
    role: "admin",
  },
  {
    id: 2,
    email: "user2@example.org",
    role: "developer",
  },
];
const invites: InvitationResponse[] = [
  {
    email: "user3@example.org",
    expired: false,
    role: "developer",
  },
  {
    email: "user4@example.org",
    expired: true,
    role: "admin",
  },
];
const team: Team = {
  id: 1,
  creator: 1,
  slug: "team",
  name: "Team",
  suspended: false,
  referralCode: "TEAM123",
  referredBy: null,
};

export const Primary: Story = {
  args: {
    members,
    invites,
    team,
  },
};

export const LoadingState: Story = {
  args: {
    members: undefined,
    invites: undefined,
    team,
  },
};
