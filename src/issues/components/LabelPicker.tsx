import { FC } from "react";
import { LoadingIcon } from "../../shared/components/LoadingIcon";
import { useLabels } from "../hooks/useLabels";

interface Props {
  selectedLabels: string[];
  onChange: ( labelName: string ) => void;
}

export const LabelPicker:FC<Props> = ({ selectedLabels, onChange}) => { // Recibe el estado de labels seleccionadas y la func que lo modifica

  const labelsQuery = useLabels(); // Data con la lista total del labels

  if( labelsQuery.isLoading )
    return (<LoadingIcon />)

  return (
    <>
      {
        labelsQuery.data?.map( label => (
          <span
              key={ label.id }                              // Si la etiqueta seleccionada esta dentro del total de etiquetas le ponemos la clase active
              className={`badge rounded-pill m-1 label-picker ${ selectedLabels.includes(label.name) ? 'label-active' : ''}`}
              style={{ border: `1px solid #${ label.color }`, color: `#${ label.color }` }}
              onClick={ () => onChange( label.name )}
          >
              { label.name }
          </span>
        )) 
      }   
    </>
  )
}
