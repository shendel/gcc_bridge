import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow, 
  TableCell,
} from './Table'
// Функция для преобразования плоского массива в иерархическую структуру
const buildTree = (items, parentId = 0) => {
  const tree = [];
  
  items.forEach(item => {
    if (item.parentId === parentId) {
      const children = buildTree(items, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  });
  
  return tree;
};

// Рекурсивный компонент для отрисовки дерева в таблице
const TreeNode = (props) => {
  const {
    node,
    level = 0,
    idKey,
    dataCells,
    actionsCell
  } = props
  const paddingLeft = `${level * 20}px`;
  
  return (
    <>
      <TableRow>
        {dataCells.map(({ key, padding, width }) => {
          return (
            <TableCell key={key} width={width}>
              <div style={(padding) ? { paddingLeft } : {}}>
                {node[key]}
              </div>
            </TableCell>
          )
        })}
        {actionsCell && (
          <TableCell className="flex justify-end">
            {actionsCell(node)}
          </TableCell>
        )}
      </TableRow>
      {node.children && node.children.map(child => (
        <TreeNode
          key={child[idKey]}
          idKey={idKey}
          node={child}
          level={level + 1}
          dataCells={dataCells}
          actionsCell={actionsCell}
        />
      ))}
    </>
  );
};

// Компонент таблицы-дерева
const TreeTable = (props) => {
  const {
    data,
    dataCells = [ { key: 'name', title: 'Name' } ],
    actionsCell = false,
    actionsCellTitle = 'Actions',
    emptyText = 'empty',
    idKey = 'id'
  } = props
  const treeData = buildTree([...data]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          {dataCells.map(({ key, title }, index) => {
            return (
              <TableHeadCell key={key}>{title}</TableHeadCell>
            )
          })}
          {actionsCell !== false && (
            <TableHeadCell>{actionsCellTitle}</TableHeadCell>
          )}
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            <>
              {treeData.map(node => (
                <TreeNode
                  key={node[idKey]}
                  idKey={idKey}
                  node={node}
                  dataCells={dataCells}
                  actionsCell={actionsCell}
                />
              ))}
            </>
          ) : (
            <TableRow>
              <TableCell
                colSpan={(dataCells.length + ((actionsCell !== false) ? 1 : 0))}
                className="text-center font-bold"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TreeTable;