const LoadingSplash = (props) => {
  return (
    <div className="bg-opacity-50 fixed inset-0 flex justify-center items-center bg-white z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  )
}


export default LoadingSplash