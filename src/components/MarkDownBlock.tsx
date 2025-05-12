import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const MarkDownBlock = (props) => {
  const { markdown } = props
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
  )
}

export default MarkDownBlock