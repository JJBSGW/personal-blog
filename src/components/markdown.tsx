import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { rehypeCodeLang, rehypeHeadingIds } from "@/lib/markdown";

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeHeadingIds, {}],
          [rehypeCodeLang, {}],
          [rehypeHighlight, {}],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
