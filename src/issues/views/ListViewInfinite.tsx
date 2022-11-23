import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { LoadingIcon } from '../../shared/components/LoadingIcon';
import { IssueList } from '../components/IssueList';
import { LabelPicker } from '../components/LabelPicker';
import { useIssuesInfinite } from '../hooks';


import { State } from '../interfaces';



export const ListViewInfinite = () => {

  const [selectedLabels, setSelectedLabels] = useState<string[]>([])  // Estado lista de etiquetas selecionadas para mostrar su contenido
  
  const [state,setState] = useState<State>(); // Estado open, close de la interface issue
  
  const { issuesQuery } = useIssuesInfinite({ state, labels: selectedLabels }); // Data de todos los issues enviando las labels seleccionadas y el state

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
                  issues={ issuesQuery.data?.pages.flat() || []}        // La data del useIssuesInfinite viene como un [[],[],[]] con flat aplanamos el array [1,2,3,4,5,6]
                  state={ state }
                  onStateChanged={ (newState) => setState( newState ) } // Cuando se hace click en All, open, close del IssueList se genera un state
                /> ) 
        }

        <button 
          disabled={ !issuesQuery.hasNextPage }
          className="btn btn-outline-primary mt-2"
          onClick={ () => issuesQuery.fetchNextPage()}  
        >
          Load more...
        </button>

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
