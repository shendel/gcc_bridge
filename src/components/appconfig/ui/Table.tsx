
const Table = (props) => {
  const { children } = props
  return (
    <div className="w-full mb-2 mt-2">
      <div className="min-w-full divide-y divide-gray-200">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="align-middle inline-block min-w-full">
            <div className="border-b border-gray-200">
              <table className="min-w-full">
                {children}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const TableHead = (props) => {
  const { children } = props
  
  return (
    <thead>
      <tr>
        {children}
      </tr>
    </thead>
  )
}
const TableBody = (props) => {
  const { children } = props
  
  return (
    <tbody>
      {children}
    </tbody>
  )
}

const TableHeadCell = (props) => {
  const { children } = props
  
  return (
    <th
      scope="col"
      className="px-6 py-3 bg-gray-300 text-left text-xs font-medium text-gray-900 align-center uppercase tracking-wider"
    >
      {children}
    </th>
  )
}

const TableRow = (props) => {
  const { children } = props
  return (
    <tr className="border-b border-gray-200 hover:bg-blue-200">{children}</tr>
  )
}

const TableCell = (props) => {
  const {
    children,
    colSpan,
    width,
    className,
    style
  } = props
  
  return (
    <td className={`px-2 py-1 ${(className) ? className : ''}`} {...{ colSpan, width }} style={style}>
      {children}
    </td>
  )
}
export {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow, 
  TableCell,
}