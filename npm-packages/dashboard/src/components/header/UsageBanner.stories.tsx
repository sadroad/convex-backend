import type { Meta, StoryObj } from "@storybook/nextjs";

import { UsageBanner } from "./UsageBanner";

const meta = {
  component: UsageBanner,
  args: {
    team: {
      id: 42,
      name: "My team",
      slug: "my-team",
      creator: 1,
      suspended: false,
      referralCode: "MYTEAM123",
      referredBy: null,
    },
  },
} satisfies Meta<typeof UsageBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Approaching: Story = {
  args: {
    variant: "Approaching",
  },
};

export const Exceeded: Story = {
  args: {
    variant: "Exceeded",
  },
};

export const Disabled: Story = {
  args: {
    variant: "Disabled",
  },
};

export const Paused: Story = {
  args: {
    variant: "Paused",
  },
};

export const ExceededSpendingLimit: Story = {
  args: {
    variant: "ExceededSpendingLimit",
  },
};
