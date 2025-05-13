import { getTranslate } from '@/translate'

export default function Paginator(props) {
  const t = getTranslate('PAGINATOR')
  const {
    page: _page,
    totalItems,
    perPage,
    href
  } = props
  const curPage = Number(_page)
  const pagesTotal = Math.ceil(totalItems / perPage)
  
  const pageTab = (page) => {
    return (
      <a href={href.replace('{page}', page)} className={(page == curPage) ? 'active' : ''}>
        {(page+1)}
      </a>
    )
  }
  if (pagesTotal > 1) {
    return (
      <div className="adminPaginator">
        <style>
        {`
          .adminPaginator {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 1em;
            padding-right: 1em;
          }
          .adminPaginator .pages {
            display: flex;
            border: 1px solid #cacaca;
            border-radius: 5px;
            background: #fff;
          }
          .adminPaginator .pages A,
          .adminPaginator .pages SPAN {
            border-left: 1px solid #838383;
            display: block;
            height: 2em;
            padding-left: 0.75em;
            padding-right: 0.75em;
            font-size: 12pt;
            font-weight: bold;
            text-decoration: none;
            text-align: center;
            vertical-align: middle;
            line-height: 2em;
            color: #111827;
          }
          .adminPaginator .pages A:hover {
            background: #f9fafb;
          }
          .adminPaginator .pages A.active {
            background: #4f46e5;
            color: #FFF;
          }
          .adminPaginator .pages A:first-child {
            border-left: none;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          .adminPaginator .pages A:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
          .adminPaginator .pageInfo {
            font-size: 0.9em;
            color: #111827;
          }
        `}
        </style>
        <div className="pageInfo">
          {t('Showing {from} to {to} of {total} results', {
            from: curPage*perPage +1,
            to: (curPage*perPage + perPage) > totalItems ? totalItems : (curPage*perPage + perPage),
            total: totalItems
          })}
        </div>
        <div className="pages">
          {pagesTotal > 10 ? (
            <>
              {(Array.apply(null, Array((curPage >= 4) ? 2 : 6))).map((empty, page) => {
                return pageTab(page)
              })}
              {(curPage >=4 && (curPage <= (pagesTotal - 6))) ? (
                <>
                  <span>...</span>
                  {pageTab(curPage-1)}
                  {pageTab(curPage)}
                  {pageTab(curPage+1)}
                  {(curPage < (pagesTotal - 5)) && (<span>...</span>)}
                </>
              ) : (
                <>
                  <span>...</span>
                </>
              )}
              <>
                {curPage > (pagesTotal - 6) && (<>{pageTab(pagesTotal -6)}</>)}
                {curPage > (pagesTotal - 6) && (<>{pageTab(pagesTotal -5)}</>)}
                {curPage > (pagesTotal - 6) && (<>{pageTab(pagesTotal -4)}</>)}
                {curPage > (pagesTotal - 6) && (<>{pageTab(pagesTotal -3)}</>)}
                {pageTab(pagesTotal -2)}
                {pageTab(pagesTotal -1)}
              </>
            </>
          ) : (
            <>
              {(Array.apply(null, Array(pagesTotal)).map(function () {})).map((empty, page) => {
                return pageTab(page)
              })}
            </>
          )}
        </div>
      </div>
    )
  }
  return null
}