import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { githubApi } from "../../api/githubApi"
import { sleep } from "../../helpers/sleep";
import { Issue, State } from "../interfaces"

interface Props {
  state?: State;
  labels: string[];
  page?: number;
}


const getIssues = async ({labels, state, page = 1 }:Props): Promise<Issue[]> => {

    await sleep(2);

    const params = new URLSearchParams();         // Habilitamos la constante params para añadir a la url los parametros state y labels
    
    if( state ) params.append( 'state', state );  // Añadimos el state (close o open | undefined)

    if (labels.length > 0) {                      // Si labels[] > 0 quiere decir que viene más de uno
      const labelString = labels.join(',');       // Creamos una constante con los labels separados por comas
      params.append('labels', labelString);       // Añadimos esa constante a los params ( asi es como la api quiere que haga )
    }

    params.append('page', page.toString());       // Añadimos también la página que queremos visualizar
    params.append('per_page', '5');               // y la cantidad de issues por página

    const { data } = await githubApi.get<Issue[]>('/issues', { params }); // La petición de los issues tendrá en cuenta los params añadidos
    return data;
}

export const useIssues = ({ state, labels }:Props) => {

    const [page, setPage] = useState(1);  // Estado para paginación

    useEffect(() => {
      setPage(1);
    }, [state, labels])   // Si cambian el state o las labels reseteamos la page a 1


    const issuesQuery = useQuery(
        ['issues', { state, labels, page }],      // La cache contendrá espacio para el state, labels y page
        () => getIssues({ labels, state, page }), // Función que genera una data según labels, state y page
    );

    const nextPage = () => {
      if( issuesQuery.data?.length === 0 ) return; // Si no hay data es que se llego al final, return.
      setPage( page + 1 )                          // Si si hay data y le damos a next aumentamos la page en 1 -> actualiza useIssues
    }

    const prevPage = () => {
      if( page > 1 ) setPage( page -1 )
    }

  return { 
    // Properties
    issuesQuery,

    // Getter
    page: issuesQuery.isFetching ? 'Loading' : page,

    // Methods
    nextPage,
    prevPage
  }
    
  
}
