

export default function Label(props) {
  const { children } = props
  
  return (
    <label className="block text-gray-700 font-bold mb-1 mt-2">{children}</label>
  )
}