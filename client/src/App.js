import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import SignInForm from './components/SignInForm'
import { Game } from './components/Game'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { RoomSelector } from './components/RoomSelector'
import io from 'socket.io-client'
export const socket = io()

export default function App() {
  const [user, setUser] = useState('')
  const navigate = useNavigate()
  const [gameValues, setGameValues] = useState(new Array(9).fill(''))
  const [roomsAndSizes, setRoomsAndSizes] = useState([])
  const [room, setRoom] = useState()
  const [role, setRole] = useState('')
  const [reset, setReset] = useState(false)

  useEffect(() => {
    if (user === '') navigate('/')
  }, [user, navigate])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Websocket connected with id:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('Websocket id disconnected:', socket.id)
    })

    socket.on('change', (newValues) => {
      console.log('CHANGE', newValues)
      setGameValues(newValues)
    })

    socket.on('roomsListUpdate', (roomsAndSizes) => {
      setRoomsAndSizes(roomsAndSizes)
    })
    socket.on('reset', () => {
      setReset(true)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('change')
      socket.off('roomsListUpdate')
      socket.off('reset')
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<SignInForm setUser={setUser} socket={socket}/>} />
      <Route
        path="/roomselector"
        element={
          <RoomSelector
            socket={socket}
            roomsAndSizes={roomsAndSizes}
            setRoom={setRoom}
            user={user}
            setRole={setRole}
          />
        }
      />
      <Route
        path="/game"
        element={
          <Game
            socket={socket}
            gameValues={gameValues}
            setGameValues={setGameValues}
            room={room}
            role={role}
            roomsAndSizes={roomsAndSizes}
            reset={reset}
            setReset={setReset}
          />
        }
      />
    </Routes>
  )
}
