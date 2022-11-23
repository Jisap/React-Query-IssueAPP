import { FC } from 'react';
import { Issue, State } from '../interfaces';
import { IssueItem } from './IssueItem';

interface Props {
    issues: Issue[];
    state?: State;
    onStateChanged: (state?:State) => void;
}

                                        // State|undefined
export const IssueList:FC<Props> = ({ issues, state, onStateChanged }) => { // Recibe la data de todos los issues
    return (
        <div className="card border-white">
            <div className="card-header bg-dark">
                <ul className="nav nav-pills card-header-pills">
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${ !state ? 'active' : '' }`}
                            onClick={() => onStateChanged()} // state->undefined
                        >All</a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${ state === State.Open ? 'active' : '' }`}
                            onClick={() => onStateChanged(State.Open)} // state->Open
                        >Open</a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className={`nav-link ${state === State.Closed ? 'active' : ''}`}
                            onClick={() => onStateChanged(State.Closed)} // state->closed
                        >Closed</a>
                    </li>
                </ul>
            </div>
            <div className="card-body text-dark">
                {
                    issues.map( issue => ( // Mapeo de la data y envio a IssueItem 
                        <IssueItem 
                            key={issue.id} 
                            issue={issue}
                        />
                    ))
                
                }                
            </div>
        </div>
    )
}
