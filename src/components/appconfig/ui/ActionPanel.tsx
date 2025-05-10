import FaIcon from '@/components/FaIcon'

const ActionPanel = (props) => {
  const {
    index = 0,
    itemsCount = 0,
    canMove = false,
    onMoveUp = (index) => {},
    onAddItem = false,
    onMoveDown = (index) => {},
    onEdit = (index) => {},
    onDelete = (index) => {}
  } = props

  const buttonClass = `text-white w-8 h-8 duration-500 ease-in-out shadow-md transition-all active:scale-95`
  const arrowEnabledClass = `bg-blue-500 hover:bg-blue-600`
  const arrowDisabledClass = `bg-gray-500 active:scale-100`
  return (
    <div className="flex">
      {canMove && (
        <>
          <button className={`${buttonClass} rounded-l-md ${(index == 0) ? arrowDisabledClass : arrowEnabledClass}`}
            disabled={!!(index ==0)}
            onClick={onMoveUp}
          >
            <FaIcon icon="arrow-up" />
          </button>
          <button className={`${buttonClass} ${(index == (itemsCount -1)) ? arrowDisabledClass : arrowEnabledClass}`}
            disabled={!!(index == (itemsCount -1))}
            onClick={onMoveDown}
          >
            <FaIcon icon="arrow-down" />
          </button>
        </>
      )}
      <button className={`bg-blue-500 ${(!canMove) ? 'rounded-l-md' : ''} hover:bg-blue-600 ${buttonClass}`} onClick={onEdit}>
        <FaIcon icon="edit" />
      </button>
      {onAddItem !== false && (
        <button className={`bg-green-500 hover:bg-blue-600 ${buttonClass}`} onClick={onAddItem}>
          <FaIcon icon="folder-plus" />
        </button>
      )}
      <button className={`rounded-r-md bg-red-500 hover:bg-red-600 ${buttonClass}`} onClick={onDelete}>
        <FaIcon icon="trash" />
      </button>
    </div>
  )
}


export default ActionPanel