import React from 'react';

function InfoModal() {
    return (
        <div id="InfoModal" className="modal" role="dialog">
            <div className="modal-dialog modal-md modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title fs-5">Dijkstras Algorithm</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <p style={{fontFamily: "Courier New", fontWeight: "800"}}>
                            1 function Dijkstra(Graph, source)<br/>
                            2<br/>
                            3      for each vertex v in Graph.Vertices:<br/>
                            4          dist[v] ← INFINITY<br/>
                            5          prev[v] ← UNDEFINED<br/>
                            6          add v to Q<br/>
                            7      dist[source] ← 0<br/>
                            8<br/>
                            9      while Q is not empty:<br/>
                            10          u ← vertex in Q with minimum dist[u]<br/>
                            11          Q.remove(u)<br/>
                            12<br/>
                            13          for each arc (u, v) in Q:<br/>
                            14              alt ← dist[u] + Graph.Edges(u, v)<br/>
                            15              if alt .less than. dist[v]:<br/>
                            16                  dist[v] ← alt<br/>
                            17                  prev[v] ← u<br/>
                            18<br/>
                            19      return dist[], prev[]<br/>
                        </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoModal;