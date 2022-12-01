import React, { useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import CustomContainer from './CustomContainer'
import tictactoelogo from './assets/tictactoe.png'
import './assets/animation.css'

export default function SignInForm({ setUser, socket }) {
  const nameRef = useRef(null)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    let user = nameRef.current.value
    setUser(user)
    socket.emit('userLoggedIn', user)
    navigate('/roomselector')
  }

  return (
    <CustomContainer>
      <div className="logoContainer">
        <img alt="" src={tictactoelogo} className="tictactoelogo" />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3 mt-3" controlId="formUsername">
          <Form.Control
            required
            placeholder="Enter username"
            autoComplete="off"
            ref={nameRef}
          />
        </Form.Group>
        <Button className="mb-3" variant="primary" type="submit">
          Play Tic-tac-toe!
        </Button>
      </Form>
    </CustomContainer>
  )
}
