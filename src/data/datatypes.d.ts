interface ProjectData {
  title: string;
  blocks: Block[];
  date: Date;
}
interface Block extends TextBlock, MediaBlock {
  type: "TEXT" | "IMAGE" | "VIDEO";
}

interface TextBlock {
  text?: string;
}

interface MediaBlock {
  src?: URL;
}
