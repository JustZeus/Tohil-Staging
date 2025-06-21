import { useContext } from 'react'
import { FiltersContext } from './context/contextSearch'

export function useFilters () {
  const { filters, setFilters } = useContext(FiltersContext)
  // console.log(filters)
  
  const filterAlert = (elements) => {
    // console.log(elements)
    return elements.filter(elements =>{
        return(
          filters.alertId === 'All' || elements.alertId === filters.alertId
        )
    })
  }

  return { filters, filterAlert, setFilters }
}

