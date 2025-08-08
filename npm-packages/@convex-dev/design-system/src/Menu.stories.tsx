import { Meta, StoryObj } from "@storybook/nextjs";
import { Menu, MenuItem, MenuLink } from "@ui/Menu";

const meta = {
  component: Menu,
  render: (args) => (
    <div className="w-fit">
      <Menu {...args} />
    </div>
  ),
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    buttonProps: {
      children: "Menu",
      variant: "neutral",
    },
    placement: "bottom",
    children: (
      <>
        <MenuItem action={() => {}} shortcut={["CtrlOrCmd", "C"]}>
          Item 1
        </MenuItem>
        <MenuItem action={() => {}} variant="danger">
          Item 2
        </MenuItem>
        <MenuLink href="/blah" shortcut={["CtrlOrCmd", "O"]}>
          Item 3 (Link)
        </MenuLink>
      </>
    ),
  },
};
