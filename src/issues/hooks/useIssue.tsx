import { useQuery } from "@tanstack/react-query"
import { githubApi } from "../../api/githubApi"
import { sleep } from "../../helpers/sleep"
import { Issue } from "../interfaces"


export const getIssueInfo = async( issueNumber:number ):Promise<Issue> => {
    await sleep(2)
    const { data } = await githubApi.get<Issue>(`/issues/${ issueNumber }`); // Data de un issue por id
    return data;
}

export const getIssueComments = async (issueNumber: number): Promise<Issue[]> => {
    await sleep(2)
    const { data } = await githubApi.get<Issue[]>(`/issues/${issueNumber}/comments`);   // Data de comentarios de un issue por id
    return data;
}

export const useIssue = ( issueNumber:number ) => {
 
    const issueQuery = useQuery(
        ['issue', issueNumber],                     // Identificador en cache 
        () => getIssueInfo( issueNumber ),          // función que le da valor 
    );

    const commentsQuery = useQuery(
        ['issue', issueNumber, 'comments'],
        () => getIssueComments(issueQuery.data!.number),
        {
            enabled: issueQuery.data !== undefined, // Solo se cargarán los comentarios si el issueQuery existe
        }
    )

    return{
        issueQuery,
        commentsQuery
    } 

  
}
