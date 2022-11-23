import { useInfiniteQuery } from "@tanstack/react-query"
import { githubApi } from "../../api/githubApi";
import { sleep } from "../../helpers/sleep";
import { Issue, State } from "../interfaces";

interface Props {
    state?: State;
    labels: string[];
    page?: number;
}

interface QueryProps {                  // Interface que usa useIssuesInfinite
    pageParam?: number;
    queryKey: ( string | Props )[]
}

const getIssues = async ({ pageParam=1, queryKey }: QueryProps): Promise<Issue[]> => {

    const [,, args] = queryKey;                   // Desestructuramos del queryKey los args y de estos el state y las labels   
    const { state, labels } = args as Props;

    await sleep(2);

    const params = new URLSearchParams();         // Habilitamos la constante params para añadir a la url los parametros state y labels

    if (state) params.append('state', state);     // Añadimos el state (close o open | undefined)

    if (labels.length > 0) {                      // Si labels[] > 0 quiere decir que viene más de uno
        const labelString = labels.join(',');     // Creamos una constante con los labels separados por comas
        params.append('labels', labelString);     // Añadimos esa constante a los params ( asi es como la api quiere que haga )
    }

    params.append('page', pageParam.toString()); // Añadimos también la página que queremos visualizar
    params.append('per_page', '5');               // y la cantidad de issues por página

    const { data } = await githubApi.get<Issue[]>('/issues', { params }); // La petición de los issues tendrá en cuenta los params añadidos
    return data;
}

export const useIssuesInfinite = ({ state, labels }:Props ) => {
    
  const issuesQuery = useInfiniteQuery(                     // useInfiniteQuery genera una data en un formato: pageParam, queryKey
    [ 'issues', 'infinite', { state, labels }],
    (data) =>  getIssues( data ),                           // Para que getIssues funcione hay que cambiar la interface que maneja la data
    {                                                       // y con esa interface luego desestrucurar las labels y el state que getIssues necesita
        
        getNextPageParam: ( lastPage, pages ) => {          // Este método permite establecer si hay más información para cargar
            if( lastPage.length === 0 ) return
            return pages.length +1
        }
    }
  )

  return {
    issuesQuery
  }
    
  
}
