import { FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FiInfo, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Issue, State } from '../interfaces';
import { getIssueComments, getIssueInfo } from '../hooks/useIssue';
import { timeSince } from '../../helpers/timeSince';

interface Props {
    issue: Issue
}


export const IssueItem:FC<Props> = ({ issue }) => { // Recibe la info de un solo issue
    
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    
    const prefetchData = () => {                // Cuando pongamos el ratón encima del issue haremos una precarga de la info del issue y sus comentarios
        
        queryClient.prefetchQuery(              // Conseguimos con esto que la carga de la información cuando hagamos click sea instantanea
            ['issue', issue.number],
            () => getIssueInfo( issue.number )
        );
        
        queryClient.prefetchQuery (
            ['issue', issue.number, 'comments'],        // Identificación de la data en cache precargada
            () => getIssueComments( issue.number )      // Función que obtiene la data
        )
    }

    const preSetData = () => {                          // Otro método para precargar la info de cada issue en la cache
        queryClient.setQueryData(                       // Se usa el método setQueryData
            ['issue', issue.number],                    // Cada info del issue se guarda en la cache con su id        
            issue,                                      // data del issue que viene por parámetro
            {
                updatedAt: new Date().getTime() + 100000 // Fecha que se considerará que la data es correcta o fresca.
            }
        );
    }

    return (
        <div className="card mb-2 issue"
             onClick={() => navigate(`/issues/issue/${issue.number}`)} // navegamos a issueView
             //onMouseEnter={ prefetchData }
             onMouseEnter={ preSetData }
        >
            <div className="card-body d-flex align-items-center">
                
                {
                    issue.state === State.Open
                        ? ( <FiInfo size={30} color="red" /> )
                        : ( <FiCheckCircle size={30} color="green" />)
                }

                <div className="d-flex flex-column flex-fill px-2">
                    <span>{ issue.title }</span>
                    <span className="issue-subinfo">#{issue.number} opened {timeSince(issue.created_at)} ago by <span className='fw-bold'>{ issue.user.login }</span></span>
                    <div>
                        { 
                            issue.labels.map(label => (
                                <span
                                    key={label.id}
                                    className="badge rounded-pill m-1"
                                    style={{ backgroundColor: `#${label.color}`, color: 'black' }}
                                >
                                    {label.name}
                                </span>
                            ))
                        }
                    </div>
                </div>

                <div className='d-flex align-items-center'>
                    <img src={ issue.user.avatar_url } alt="User Avatar" className="avatar" />
                    <span className='px-2'>{ issue.comments }</span>
                    <FiMessageSquare />
                </div>

            </div>
        </div>
    )
}
