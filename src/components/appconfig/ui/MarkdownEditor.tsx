import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

const MarkdownEditor = (props) => {
  const {
    value,
    setValue = () => {}
  } = props

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm">
      <MdEditor
        value={value}
        style={{ height: '200px' }}
        renderHTML={(text) => mdParser.render(text)}
        onChange={({ text }) => setValue(text) }
      />
    </div>
  );
};

export default MarkdownEditor;