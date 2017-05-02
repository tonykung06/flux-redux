import {createStore, combineReducers} from 'redux'

export const ONLINE = 'ONLINE'
export const AWAY = 'AWAY'
export const BUSY = 'BUSY'
export const OFFLINE = 'OFFLINE'

export const UPDATE_STATUS = 'UPDATE_STATUS'
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE'


const defaultState = {
	messages: [{
		date: new Date('2017-03-21 10:33:02'),
		postedBy: 'Tony',
		content: 'Tony\'s first message'
	}, {
		date: new Date('2017-03-21 11:33:02'),
		postedBy: 'Wini',
		content: 'Wini\'s first message'
	}, {
		date: new Date('2017-03-21 12:33:02'),
		postedBy: 'Tony',
		content: 'Tony\'s second message'
	}],
	userStatus: ONLINE
}

// NOTE: global reducer handling all states in the app
// const reducer = (state = defaultState, {type, value}) => {
// 	switch (type) {
// 		case UPDATE_STATUS:
// 			return {
// 				...state,
// 				userStatus: value				
// 			}
// 			break
// 	}
// 	return state
// }

// combining reducers
const userSatusReducer = (state = defaultState.userStatus, {type, value}) => {
	switch (type) {
		case UPDATE_STATUS:
			return value
			break
	}
	return state
}
const messageReducer = (state = defaultState.messages, {type, value, postedBy, date}) => {
	console.log(type, value, postedBy, date)
	switch (type) {
		case CREATE_NEW_MESSAGE:
			return [
				{
					date,
					postedBy,
					content: value
				},
				...state
			]
			break
	}
	return state
}
const combinedReducers = combineReducers({
	userStatus: userSatusReducer,
	messages: messageReducer
})
const store = createStore(combinedReducers)

const render = () => {
	const {messages, userStatus} = store.getState()
	document.getElementById('messages').innerHTML = messages.sort((a, b) => (
		b.date - a.date
	)).map(msg => (
		`
		<div>
			${msg.postedBy}: ${msg.content}
		</div>
		`
	)).join('')

	document.forms.newMessage.fields.disabled = userStatus === OFFLINE
	document.forms.newMessage.newMessage.value = ''
}

const statusUpdateAction = value => ({
	type: UPDATE_STATUS,
	value
})
const newMessageAction = (content, postedBy) => ({
	type: CREATE_NEW_MESSAGE,
	value: content,
	postedBy,
	date: new Date()
})


document.forms.newMessage.addEventListener('submit', e => {
	e.preventDefault()
	store.dispatch(newMessageAction(
		e.target.newMessage.value,
		localStorage['preferences'] && JSON.parse(localStorage['preferences']).userName ? JSON.parse(localStorage['preferences']).userName : 'Tony'
	))
})
document.forms.selectStatus.status.addEventListener('change', e => {
	e.preventDefault()
	store.dispatch(statusUpdateAction(e.target.value))
})

render()

store.subscribe(render)
