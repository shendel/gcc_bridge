
const Switcher = (props) => {
  const {
    tabs = [],
    active = '',
    onClick = (tab) => {}
  } = props
  
  return (
    <div className="flex justify-center mb-4">
      {tabs.map(({ title, key}) => {
        return (
          <button
            key={key}
            onClick={() => { if (active != key) { onClick(key) } }}
            className={`px-4 py-2 mr-2 bg-${
              active === key ? "blue-500 text-white" : "gray-200 text-gray-700"
            } rounded hover:bg-blue-600 hover:text-white`}
          >
            {title}
          </button>
        )
      })}
    </div>
  )
}

export default Switcher