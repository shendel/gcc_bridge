const LoadingIndicator = (props) => {
  return (
    <div className="fixed left-0 bottom-0 w-8 h-8 flex justify-center items-center bg-white z-50">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  )
}


export default LoadingIndicator