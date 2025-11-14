import SentenceCompletionInput from "@/app/(question)/question/_components/SentenceCompletionInput";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Components/AnswerUploadField",
  component: SentenceCompletionInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof SentenceCompletionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: "ㄱ",
    value: "Hello, world!",
    className: "w-full",
    disabled: false,
    isSubmitted: false,
  },
};
