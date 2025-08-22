import React from 'react';
import './App.css';
import {newMaze} from "./mazeUtils";
import {MazeAlgorithm} from "./types";

function RenderMap({ map, setMap }: { map: string[], setMap: React.Dispatch<React.SetStateAction<string[]>> }) {
    React.useEffect(() => {
        // Load default map
        setMap(newMaze(141,141, MazeAlgorithm.STACKDFS).slice());
    },[setMap])

    function findCellType(c: string): string {
        switch (c) {
            case '#':
                return 'wall'
            case 'S':
            case 'E':
                return 'special'
            case 'P':
                return 'path'
            default:
                return 'empty'
        }
    }

    return (
        <div className="container">
            <table className="maze">
                <tbody>
                {map.map((row, idx) => (
                    <tr key={idx}>
                        {[...row].map(item => (
                            <td data-type={findCellType(item)}></td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default RenderMap;