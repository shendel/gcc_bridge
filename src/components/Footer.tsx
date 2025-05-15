import { useEffect, useState } from "react"
import { useMarkDown } from '@/contexts/MarkDownContext'
import MarkDownBlock from '@/components/MarkDownBlock'
import LoadingPlaceholder from '@/components/LoadingPlaceholder'

const Footer = () => {
  const { getFile } = useMarkDown()
  
  const [ footerContent, setFooterContent ] = useState(false)
  useEffect(() => {
    getFile('./footer.md').then((content) => {
      setFooterContent(content)
    }).catch((err) => {})
  }, [])
  return (
    <footer className="bg-white py-8 mt-4 border-t-2 pt-8 text-center">
      {footerContent !== false && (
        <MarkDownBlock markdown={footerContent} />
      )}
    </footer>
  );
};

export default Footer;