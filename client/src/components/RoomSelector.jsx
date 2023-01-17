import React from 'react'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import CustomContainer from './CustomContainer'
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import tictactoelogo from './assets/tictactoe.png'

export function RoomSelector({
  socket,
  roomsAndSizes,
  setRoom,
  user,
  setRole,
}) {
  const navigate = useNavigate()

  function joinRoom(name, size) {
    setRoom(name)
    let role = ''
    if (size === 0) role = 'playsX'
    else if (size === 1) role = 'playsO'
    else if (size >= 2) role = 'spectator'
    setRole(role)
    socket.emit('userJoinedRoom', name, role)
    navigate('/game')
  }

  return (
    <CustomContainer>
      <Stack
        gap={3}
        className="d-flex align-items-center justify-content-center text-center flex-wrap"
      >
        <img alt="" src={tictactoelogo} />
        <Button
          onClick={() => {
            joinRoom(`${user}'s Room`, 0)
          }}
        >
          Create New Room
        </Button>
        {roomsAndSizes.map((room) => (
          <Button
            key={uuid()}
            variant="secondary"
            onClick={() => {
              joinRoom(room.name, room.size)
            }}
          >
            {room.size < 2
              ? `Join ${room.name}`
              : `Spectate ${room.name} (full)`}
          </Button>
        ))}
      </Stack>
    </CustomContainer>
  )
}
