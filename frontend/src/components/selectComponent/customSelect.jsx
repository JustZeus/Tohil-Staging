import { useContext  } from 'react';
import {OptionSelectContext} from "./context/selectContext"
import './CustomSelect.css'; 
import { useFilters } from './useFiltersSeach';

export function CustomSelect({options}){
  const {optionSelect, setOptionSelect} = useContext(OptionSelectContext)
  const { filters, setFilters } = useFilters()


  function handleOption(op, id){
    setOptionSelect(op)
    let newQuery = id;
    // console.log(newQuery)
    if(!newQuery){
        newQuery = "All"
    }
    setFilters(prevState => ({
        ...prevState,
        alertId: newQuery,
    }))
  }

  return(
    
      <div className="select-menu">
        <label>
          <input type="checkbox" className="checkBoxSelectMap"/>
          <div className="select-btn">
              <span className="sBtn-text">{optionSelect}</span>
          </div>
          <ul className="options">
          <li className="option" onClick={() => handleOption("Show all sectors", "All")}><span className="option-text">Show all sectors</span></li>
              {options.map(optionMap => (
                  <li className="option" key={optionMap.sector.id} onClick={() => handleOption(optionMap.sector.name, optionMap.alertId)}>
                      <span className="option-text">{optionMap.sector.name}</span>
                  </li>
              ))}
          </ul>
        </label>
      </div>
  )
}