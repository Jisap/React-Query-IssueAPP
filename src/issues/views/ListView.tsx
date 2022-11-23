import { useState } from 'react';
import { LoadingIcon } from '../../shared/components/LoadingIcon';
import { IssueList } from '../components/IssueList';
import { LabelPicker } from '../components/LabelPicker';
import { useIssues } from '../hooks';
import { State } from '../interfaces';



export const ListView = () => {

  const [selectedLabels, setSelectedLabels] = useState<string[]>([])  // Estado lista de etiquetas selecionadas para mostrar su contenido
  
  const [state,setState] = useState<State>(); // Estado open, close de la interface issue
  
  const { issuesQuery, page, nextPage, prevPage } = useIssues({ state, labels: selectedLabels }); // Data de todos los issues enviando la pestaña seleccionada y las labels seleccionadas y el state

  const onLabelChanged = ( labelName: string ) => {
    ( selectedLabels.includes( labelName ) )                                      // Si la etiqueta seleccionada esta dentro del []
      ? setSelectedLabels( selectedLabels.filter( label => label !== labelName )) // borramos la etiqueta de []
      : setSelectedLabels([...selectedLabels, labelName])                         // Sino esta en el [] la añadimos
  }

  return (
    <div className="row mt-5">
      
      <div className="col-8">
        {
          issuesQuery.isLoading 
            ? ( <LoadingIcon /> ) 
            : ( <IssueList 
                  issues={ issuesQuery.data || []}
                  state={ state }
                  onStateChanged={ (newState) => setState( newState ) } // Cuando se hace click en All, open, close del IssueList se genera un state
                /> ) 
        }

        <div className="d-flex mt-2 justify-content-between align-item-center">
          <button 
            className="btn btn-outline-primary"
            disabled={ issuesQuery.isFetching }
            onClick={ prevPage }
            >Prev
          </button>
          
          <span>{ page }</span>
          
          <button
            className="btn btn-outline-primary"
            disabled={ issuesQuery.isFetching }
            onClick={ nextPage }  
          >Next
          </button>
        
        </div>

      </div>
      
      <div className="col-4">
        <LabelPicker 
          selectedLabels={ selectedLabels }
          onChange={ (labelName) => onLabelChanged(labelName)}  // Cuando se hace click em una etiqueta se selecciona su nombre y se envía a la función -> selectedLabels
        />
      </div>
    </div>
  )
}
