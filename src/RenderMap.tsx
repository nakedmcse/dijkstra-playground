import React from 'react';
import './App.css';

function RenderMap() {
    const [map, setMap] = React.useState<string[]>([]);
    React.useEffect(() => {
        // Load default map
        fetch("/maze.txt")
            .then((res) => res.text())
            .then((text) => {
                setMap(text.split(/\r?\n/));
            });
    },[])

    function findCellType(c: string): string {
        switch (c) {
            case '#':
                return 'wall'
            case 'S':
                return 'special'
            case 'E':
                return 'special'
            default:
                return 'empty'
        }
    }

    return (
        <div className="container">
            <table className="maze">
                {map.map((row, idx) => (
                    <tr key={idx}>
                        {[...row].map(item => (
                            <td data-type={findCellType(item)}></td>
                        ))}
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default RenderMap;