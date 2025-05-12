import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import { useStorageProvider } from '@/storage/StorageProvider'
import Head from "next/head";


const MarkdownRenderer = (props) => {
  const {
    url,
    title
  } = props
  const [markdown, setMarkdown] = useState("");

  const {
    storageData: {
      exdata: {
        whitelabel,
      }
    }
  } = useStorageProvider()
  
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
        setMarkdown("Ошибка загрузки Markdown-файла.");
      }
    };

    fetchMarkdown();
  }, [url]);

  return (
    <div className="markdown-container">
      <Head>
        <title>{whitelabel.siteTitle.replace('[PAGE_TITLE]',  title)}</title>
      </Head>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};

const MarkDownViewer = (props) => {
  const {
    url,
    title
  } = props
  return (props) => {
    return new MarkdownRenderer({ url, title })
  }
}
export default MarkDownViewer