import React, { useState, useEffect } from 'react';
import FaIcon from '@/components/FaIcon'

// Функция для преобразования плоского массива в иерархическую структуру
const buildTree = (items, parentId = 0, idKey = `id`, parentIdKey = `parentId`) => {
  const tree = [];
  
  items.forEach(item => {
    if (item[parentIdKey] === parentId) {
      const children = buildTree(items, item[idKey], idKey, parentIdKey);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  });
  
  return tree;
};

// Кастомный SELECT в виде дерева
const TreeSelect = (props) => {
  const {
    data,
    value,
    setValue,
    idKey = `id`,
    parentIdKey = `parentId`,
    titleKey = `name`,
    noParentTitle = `ROOT (Without parent group)`,
    hasNoParent = false,
    disabled = false,
    lockedItem = false,
    placeholder = "Select item",
    renderTitle = false
  } = props

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  
  const treeData = buildTree(data, 0, idKey, parentIdKey );
  
  const handleSelect = (item) => {
    setSelected(item);
    setIsOpen(false);
    setValue(item[idKey] || item);
  };
  
  useEffect(() => {
    const _item = data.find((item) => {
      return (item[idKey] == value)
    })
    if (_item) {
      setSelected(_item)
    } else {
      setSelected(0)
    }
  }, [ value, data ])
  
  const renderOptions = (items, level = 0, isLocked = false) => {
    const paddingLeft = `${level * 15}px`;
    
    return items.map(item => (
      <div key={item[idKey]}>
        <div 
          className={`
            px-4 py-2 flex justify-between
            ${(isLocked || ((lockedItem !== false) && (lockedItem == item[idKey])))
              ? 'bg-gray-300'
              : 'hover:bg-blue-100 cursor-pointer'
            }
          `}
          onClick={() => {
            if (!(isLocked || ((lockedItem !== false) && (lockedItem == item[idKey])))) {
              handleSelect(item)
            }
          }}
        >
          <div style={{ paddingLeft }}>
            {(renderTitle !== false) ? renderTitle(item) : item[titleKey]}
          </div>
        </div>
        {item.children && renderOptions(
          item.children, 
          level + 1,
          isLocked || ((lockedItem !== false) && (item[idKey] == lockedItem))
        )}
      </div>
    ));
  };
  
  return (
    <div className="relative">
      <button
        type="button"
        className={`w-full px-4 py-2 ${(disabled) ? 'bg-gray-300 border-gray-500' : 'bg-white'} border rounded focus:outline-none border-gray-300 text-left relative`}
        onClick={() => { if (!disabled) { setIsOpen(!isOpen) }}}
      >
        <span>
          {selected && selected[titleKey]
            ? (renderTitle !== false) ? renderTitle(selected) : selected[titleKey] 
            : (hasNoParent) ? noParentTitle : placeholder
          }
        </span>
        <em className="absolute right-2 top-0 bottom-0 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 transform transition-transform duration-300 ease-in-out`}
            fill="currentColor"
          >
            <polygon
              points={
                !isOpen ? "0,6 24,6 12,18" : "0,18 24,18 12,6"
              }
            />
          </svg>
        </em>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed z-9 left-0 top-0 right-0 bottom-0 bg-gray-300 opacity-0" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
            {hasNoParent ? (
              <div>
                <div 
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex justify-between"
                  onClick={() => { handleSelect(0) }}
                >
                  {noParentTitle}
                </div>
                <>{renderOptions(treeData)}</>
              </div>
            ) : (
              <>{renderOptions(treeData)}</>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TreeSelect