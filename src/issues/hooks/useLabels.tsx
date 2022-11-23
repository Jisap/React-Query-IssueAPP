import { useQuery } from "@tanstack/react-query";
import { githubApi } from "../../api/githubApi";
import { sleep } from "../../helpers/sleep";
import { Label } from "../interfaces/label";



const getLabels = async (): Promise<Label[]> => {
    await sleep(2);
    const { data } = await githubApi.get<Label[]>('/labels?per_page=100',{
        headers: {
            Authorization: null
        }
    });
    //const res = await fetch('https://api.github.com/repos/facebook/react/labels');
    //const data = await res.json();
    console.log(data)
    return data;
}

export const useLabels = () => {

    const labelsQuery = useQuery(
        ['labels'],
        getLabels,
        {
            //refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 60,      // Los datos solo se recargaran una vez por hora o cuando se recargue la app por completo
            //initialData: [],              // Proporciona datos a una consulta para rellenar previamente su cache si esta vacio
            placeholderData: [              // Mientras se hace la petición se muestra esta data            
                { 
                    id: 69105383,
                    node_id: "MDU6TGFiZWw2OTEwNTM4Mw==",
                    url: "https://api.github.com/repos/facebook/react/labels/Browser:%20IE",
                    name: "Browser: IE",
                    color: "c7def8",
                    default: false,
                },
                { 
                    id: 69105358,
                    node_id: "MDU6TGFiZWw2OTEwNTM1OA==",
                    url: "https://api.github.com/repos/facebook/react/labels/Browser:%20Safari",
                    name: "Browser: Safari",
                    color: "c7def8",
                    default: false,
                }
            ]
        }
    );

    return labelsQuery

}