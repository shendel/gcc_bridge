

const Select = (props) => {
  const {
    value,
    onChange,
    children,
    disabled,
  } = props
  
  const classNormal = `w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500`
  const classDisabled = `w-full px-4 py-2 border bg-gray-300 border-gray-700 rounded focus:outline-none focus:border-blue-500`
  return (
    <select
      value={value}
      onChange={(e) => { onChange(e.target.value) }}
      disabled={disabled}
      className={(disabled) ? classDisabled : classNormal}
    >
      {children}
    </select>
  )
}

export default Select