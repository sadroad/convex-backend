import { Meta, StoryObj } from "@storybook/nextjs";
import { ReadonlyCode } from "@common/elements/ReadonlyCode";

const meta = {
  component: ReadonlyCode,
  args: {
    language: "javascript",
    path: "example.js",
  },
  render: (args) => (
    <div style={{ height: "100vh", background: "#eee" }}>
      <ReadonlyCode {...args} />
    </div>
  ),
} satisfies Meta<typeof ReadonlyCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ParentHeight: Story = {
  args: {
    code: 'console.log("Hello World");',
  },
};

export const ContentHeight: Story = {
  args: {
    language: "python",
    code: 'for i in range(10):\n\tprint("Hello world")',
    path: "example.py",
    height: { type: "content" },
  },
};

export const ContentHeightWithMax: Story = {
  args: {
    code: 'console.log("Hello World");\n'.repeat(100),
    height: {
      type: "content",
      maxHeightRem: 20,
    },
  },
};

export const HighlightLines: Story = {
  args: {
    code: 'console.log("Hello World");\n'.repeat(100),
    highlightLines: {
      startLineNumber: 10,
      endLineNumber: 20,
    },
  },
};
