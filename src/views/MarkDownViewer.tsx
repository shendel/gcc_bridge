import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import Head from "next/head";


export const MarkdownRenderer = (props) => {
  const {
    url,
    title,
    noTitle = false
  } = props
  const [markdown, setMarkdown] = useState("");

  
  useEffect(() => {
    // Загружаем Markdown-файл по URL
    const fetchMarkdown = async () => {
      try {
        console.log('>>>> MarkDownViewer - begin load', url)
        const response = await axios.get(url);
        setMarkdown(response.data); // Сохраняем содержимое файла
        console.log('>>> Is loaded')
      } catch (error) {
        console.error("Ошибка при загрузке Markdown:", error);
        setMarkdown("Fail load Markdown-file.");
      }
    };

    fetchMarkdown();
  }, [url]);

  return (
    <div className="markdown-container">
      {!noTitle && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};

const MarkDownViewer = (props) => {
  const {
    url,
    title,
    noTitle
  } = props
  return (props) => {
    return new MarkdownRenderer({ url, title, noTitle })
  }
}
export default MarkDownViewer