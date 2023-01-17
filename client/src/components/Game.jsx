import React, { useState, useEffect, useCallback } from 'react'
import CustomContainer from './CustomContainer'
import { v4 as uuid } from 'uuid'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './assets/tiles.css'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { useNavigate } from 'react-router-dom'

export function Game({
  socket,
  gameValues,
  setGameValues,
  room,
  role,
  roomsAndSizes,
  reset,
  setReset,
}) {
  const [canClick, setCanClick] = useState(role === 'playsX' ? true : false)
  const [playerCount, setPlayerCount] = useState(1)
  const [gameResult, setgameResult] = useState('')
  const [lastMove, setLastMove] = useState('')
  const [winComb, setWinComb] = useState([])
  const navigate = useNavigate()

  function handleClick(index) {
    let newValue
    if (role === 'playsX') newValue = 'X'
    else if (role === 'playsO') newValue = 'O'
    let newValues = [...gameValues]
    newValues[index] = newValue
    socket.emit('click', newValues, room)
  }

  const startOver = useCallback((reason) => {
    if (reason === 'disconnect') {
      socket.emit('deleteRoom', room)
      alert('Your opponent has disconnected')
    }
    navigate('/')
    window.location.reload(true)
  }, [navigate, room, socket])

  useEffect(() => {
    if (reset) {
      setGameValues(new Array(9).fill(''))
      setgameResult('')
      setWinComb([])
      setReset(false)
    }
  }, [reset, setGameValues, setReset])

  useEffect(() => {
    if (playerCount < 2 && gameValues.some((value) => value !== ''))
      startOver('disconnect')
  }, [playerCount, gameValues, navigate, socket, room, startOver])

  useEffect(() => {
    setCanClick((canClick) => !canClick)
  }, [gameValues])

  useEffect(() => {
    if (roomsAndSizes.length > 0) {
      let currRoom = roomsAndSizes.find((el) => el.name === room)
      if (currRoom) setPlayerCount(currRoom.size)
    }
  }, [roomsAndSizes, room])

  useEffect(() => {
    let combs = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    combs.forEach((comb) => {
      if (
        gameValues[comb[0]] === gameValues[comb[1]] &&
        gameValues[comb[1]] === gameValues[comb[2]] &&
        gameValues[comb[0]] !== ''
      ) {
        setgameResult(role.includes(lastMove) ? `You won! 😊` : `You lost! ☹`)
        setLastMove(gameValues[comb[0]])
        setWinComb(comb)
      }
    })
  }, [gameValues, role, lastMove])

  useEffect(() => {
    if (!gameResult && gameValues.every((value) => value !== ''))
      setgameResult(`It's a draw! 😒`)
  }, [gameResult, gameValues])

  return (
    <CustomContainer>
      {playerCount > 1 ? (
        <>
          <Container className="mt-5 container">
            <Row>
              {gameValues.map((tile, index) => (
                <Col xs="4" className="col mt-1" key={uuid()}>
                  <Button
                    className="tile"
                    variant={winComb.includes(index) ? 'danger' : 'primary'}
                    disabled={
                      gameValues[index] ||
                      role === 'spectator' ||
                      !canClick ||
                      gameResult
                        ? true
                        : false
                    }
                    onClick={() => {
                      handleClick(index)
                    }}
                  >
                    {gameValues[index]}
                  </Button>
                </Col>
              ))}
            </Row>
          </Container>
          {gameResult && (
            <>
              <h2 className="mt-4">
                {role === 'spectator'
                  ? gameResult !== `It's a draw! 😒`
                    ? `${lastMove}'s win!`
                    : gameResult
                  : gameResult}
              </h2>
              <ButtonGroup>
                {role !== 'spectator' && (
                  <Button
                    className="mt-1"
                    onClick={() => {
                      socket.emit('click', ['reset'], room)
                    }}
                  >
                    Go again
                  </Button>
                )}
                <Button onClick={startOver} className="mt-1">
                  Exit
                </Button>
              </ButtonGroup>
            </>
          )}
        </>
      ) : (
        <h2>
          Waiting for a second player...{' '}
          <Spinner animation="border" variant="primary" />
        </h2>
      )}
    </CustomContainer>
  )
}
