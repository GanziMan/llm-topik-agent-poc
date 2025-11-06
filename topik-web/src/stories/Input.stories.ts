import AnswerUploadField from "@/app/(question)/question/_components/AnswerUploadField";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/AnswerUploadField",
  component: AnswerUploadField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof AnswerUploadField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "Hello, world!",
    className: "w-full",
  },
};
