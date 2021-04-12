import React from 'react';
import queryString from 'query-string';
import io from "socket.io-client";
import Square from '../../component/grid/index';
import './index.scss';
import CustomCard from '../../component/card';
import CustomButton from '../../component/button';
import { SOCKET_ENDPOINT } from '../../constant';

const socket = io(SOCKET_ENDPOINT);
export const Game = ({ history, location }) => {
    const [board, setBoard] = React.useState([]);
    const [currentRoomId, setCurrentRoomId] = React.useState('');
    const [currentTurn, setCurrentTurn] = React.useState('');
    const [isWaiting, setIsWaiting] = React.useState(true);
    const [joinError, setJoinError] = React.useState();
    const [{ xWin, oWin }, setWins] = React.useState({ xWin: 0, oWin: 0 });
    const [result, setResult] = React.useState('');
    const [playerMapping, setPlayerMapping] = React.useState({ X: '', O: '' });

    React.useEffect(() => {
        return history.listen(location => {
            console.log(history.action, history)
            if (history.action === "POP") {
                socket.emit('manualDisconnect', { socketId: socket.id }, ({ errorType, error }) => {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        })

    }, [history]);

    React.useEffect(() => {
        const { type, roomId } = queryString.parse(location.search);
        if (roomId) {
            socket.emit('joinRoom', { roomId }, ({ errorType, error }) => {
                if (error) {
                    console.log(error);
                    setJoinError(` Unable to join the room, ${error}`);
                }
            });
        } else {
            socket.emit('startRoom', { type }, ({ errorType, error }) => {
                if (error) {
                    console.log(error)
                }
            });
        }

    }, [location.search]);

    React.useEffect(() => {
        socket.on("gameInit", (data) => {
            console.log(data);
            if (data && data.roomId) {
                setCurrentRoomId(data.roomId);
            }
        });
    }, [])

    React.useEffect(() => {
        socket.on("opponentJoined", (data) => {
            console.log('player Joined', data);
            setCurrentRoomId(data.roomId);
            setCurrentTurn(data.currentTurn);
            setBoard(data.board);
            setIsWaiting(false);
            setJoinError('');
            extractIdMapping(data.players)
        });
    }, [])

    React.useEffect(() => {
        socket.on("nextMove", ({ currentTurn, board }) => {
            setCurrentTurn(currentTurn);
            setBoard(board);
        });
    }, [])

    React.useEffect(() => {
        socket.on("gameResult", ({ result, combination, symbol }) => {
            if (result === 'Win') {
                let wins = symbol === "X" ? 'xWin' : 'oWin';
                setWins(prevState => {
                    return { ...prevState, [wins]: prevState[wins] + 1 }
                })
                setResult(symbol);
            } else if (result === "Tie") {
                setResult(result)
            }
        });
    }, [])

    React.useEffect(() => {
        socket.on("disconnected", ({ socketId, roomId }) => {
            if (socket && socket.id !== socketId) {
                setWins(prevState => {
                    return { xWin: 0, oWin: 0 }
                })
                setJoinError(`Opponent Left!, Invite someone to join ${roomId}`);
            }
        });
    }, []);

    React.useEffect(() => {
        socket.on("resetGame", ({ board, currentTurn }) => {
            setResult(false);
            setBoard(board);
            setCurrentTurn(currentTurn);
        });
    }, [])

    const extractIdMapping = (players) => {
        let mapping = {};
        players.forEach(ele => { mapping[ele.symbol] = ele.id })
        setPlayerMapping(prevState => { return { ...prevState, ...mapping } });
    }

    const handleNext = (param) => {
        if (param === 'home') {
            history.push('/');
        } else if (param === 'resetGame') {
            socket.emit('resetBoard', { roomId: currentRoomId }, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        }
    }

    const handleOnClick = (index) => {
        if (currentTurn !== socket.id || typeof board[index] !== 'number') {
            return
        }
        socket.emit('onMove', { roomId: currentRoomId, index }, ({ errorType, error }) => {
            if (error) {
                console.log(error);
                alert(error);
            }
        });
    }

    const renderBoard = () => {
        let reactNode = [];
        let styles = ["b-bottom-right", "b-bottom-right", 'b-bottom', "b-bottom-right", "b-bottom-right", "b-bottom", "b-right", "b-right"]
        for (let index = 0; index < 3; index++) {
            let node = [];
            for (let innerIndex = 0; innerIndex < 3; innerIndex++) {
                let squareIndex = index * 3 + innerIndex
                node.push(<Square className={styles[squareIndex]} onClick={() => handleOnClick(squareIndex)} state={typeof board[squareIndex] === 'number' ? '' : board[squareIndex]} />)
            }
            reactNode.push(<div className="row jc-center">{node}</div>);
        }
        return <div>{reactNode}</div>;
    }

    return (
        <div className="game">
            <div className="game-content">
                {joinError ?
                    <CustomCard>
                        <h3>
                            {joinError}
                        </h3>
                        <CustomButton type={'primary'} param={"home"} handleClick={handleNext} text="Go To Home" />
                    </CustomCard>
                    :
                    isWaiting ?
                        <CustomCard>
                            <h3>Waiting for opponent</h3>
                            {currentRoomId && <h1> RoomID : {currentRoomId} </h1>}
                        </CustomCard>
                        :
                        <>
                            <div className="game-content-header">
                                <div className={`game-content-header-title ${currentTurn === playerMapping['O'] ? 'bdr-green' : 'bdr-gray'}`}>
                                    <span className={`game-content-header-title-left`}>
                                        O
                                    </span>
                                    <span className={`game-content-header-title-right`}>
                                        {oWin}
                                    </span>
                                </div>
                                <div className={`game-content-header-title ${currentTurn === playerMapping['X'] ? 'bdr-green' : 'bdr-gray'}`}>
                                    <span className={`game-content-header-title-left`}>
                                        X
                                    </span>
                                    <span className={`game-content-header-title-right`}>
                                        {xWin}
                                    </span>
                                </div>
                            </div>
                            {
                                result ?
                                    <div className="game-content-result">
                                        {result === "Tie"
                                            ?
                                            <>
                                                <h2>
                                                    Tie!
                                                </h2>
                                            </>
                                            :
                                            <>
                                                <h1>
                                                    {result}
                                                </h1>
                                                <h2>
                                                    Winner!
                                                 </h2>
                                            </>
                                        }
                                        <button className="game-content-result-button" onClick={() => handleNext('resetGame')}>
                                            click here to restart game
                                        </button>
                                    </div>
                                    :
                                    renderBoard()
                            }
                        </>
                }
            </div>
        </div>
    );
};

