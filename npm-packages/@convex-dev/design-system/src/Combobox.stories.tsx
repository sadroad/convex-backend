import { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentProps, useState } from "react";
import { Combobox } from "@ui/Combobox";

const meta = {
  component: Combobox,
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

function Example(args: Omit<ComponentProps<typeof Combobox>, "Option">) {
  const [selectedOption, setSelectedOption] = useState<string>("1");
  return (
    <Combobox
      {...args}
      options={[
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" },
        { label: "Option 3", value: "3" },
        { label: "Option 4", value: "4" },
        { label: "Option 5", value: "5" },
        { label: "Option 6", value: "6" },
        { label: "Option 7", value: "7" },
      ]}
      selectedOption={selectedOption}
      setSelectedOption={(opt: string | null) => opt && setSelectedOption(opt)}
    />
  );
}

export const Default: Story = {};
