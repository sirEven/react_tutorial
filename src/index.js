import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                key={"square " + i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRows() {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare(i * 3 + j));
            }
            rows.push(<div key={"row" + i} className='board-row'>{row}</div>);
        }
        return rows;
    }

    render() {
        return <div>{this.renderRows()}</div>;
    }
}

function createLocationTable(rows, columns) {

    function storeLocation(xVal, yVal, array) {
        array.push({ x: xVal, y: yVal });
    }

    var locationTable = [];
    for (var x = 0; x < rows; x++) {
        for (var y = 0; y < columns; y++) {
            storeLocation(x, y, locationTable)
        }
    }
    return locationTable
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.rows = 3;
        this.columns = 3;
        this.locationTable = createLocationTable(this.rows, this.columns);
        this.state = {
            history: [{
                squares: Array(this.rows * this.columns).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isDescending: true
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    sortHistory() {
        this.setState({
            isDescending: !this.state.isDescending
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const locations = this.locationTable;
        console.log('const locations: ' + locations)
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: locations[i],

            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const location = history[move].location;

            const desc = move ? 'Go to move #' + move + ', (' + location.x + ', ' + location.y + ')' : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
                    <button onClick={() => this.sortHistory()}>
                        Sort by: {this.state.isDescending ? "Descending" : "Ascending"}
                    </button>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}