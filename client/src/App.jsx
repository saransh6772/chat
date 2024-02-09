import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Box, Container, Typography, TextField, Button, Stack } from '@mui/material'

const App = () => {
	const socket = useMemo(() => io("http://localhost:3000",{withCredentials:true}), [])
	const [message, setMessage] = useState('')
	const [room, setRoom] = useState('')
	const [socketId, setSocketId] = useState('')
	const [messages, setMessages] = useState([])
	const [roomName, setRoomName] = useState('')
	const handleSubmit = (e) => {
		e.preventDefault();
		socket.emit("message", { room, message })
		setMessage('')
	}
	const joinRoomHandler = (e) => {
		e.preventDefault();
		socket.emit('join-room', roomName)
		setRoomName('')
	}
	useEffect(() => {
		socket.on('connect', () => {
			setSocketId(socket.id)
			console.log('connected', socket.id)
		})
		socket.on("receive-message", (data) => {
			console.log(data)
			setMessages((messages) => [...messages, data])
		})
		socket.on('welcome', (data) => {
			console.log(data)
		})
		return () => {
			socket.disconnect();
		};
	}, [])
	return (
		<Container maxWidth="sm">
			<Box sx={{ height: 200 }}></Box>
			<Typography variant="h6" component="div" gutterBottom>{socketId}</Typography>
			<form onSubmit={joinRoomHandler}>
				<h5>Join Room</h5>
				<TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} id='outlined-basic' label='Room Name' variant='outlined'></TextField>
				<Button type='submit' variant='contained' color='primary'>Join</Button>
			</form>
			<form onSubmit={handleSubmit}>
				<TextField value={message} onChange={(e) => setMessage(e.target.value)} id='outlined-basic' label='Message' variant='outlined'></TextField>
				<TextField value={room} onChange={(e) => setRoom(e.target.value)} id='outlined-basic' label='Room' variant='outlined'></TextField>
				<Button type='submit' variant='contained' color='primary'>Send</Button>
			</form>
			<Stack>
				{
					messages.map((message, index) => (
						<Typography key={index} variant="body1" component="div">{message}</Typography>
					))
				}
			</Stack>
		</Container>
	)
}

export default App