import {Dispatcher, Store} from './flux'

// action creators
const UPDATE_USERNAME = 'UPDATE_USERNAME';
const UPDATE_FONT_SIZE_PREFERENCE = 'UPDATE_FONT_SIZE_PREFERENCE';
const userNameUpdateAction = name => {
	return {
		type: UPDATE_USERNAME,
		value: name
	}
}
const fontSizePreferenceUpdateAction = size => {
	return {
		type: UPDATE_FONT_SIZE_PREFERENCE,
		value: size
	};
};

class UserPreferenceStore extends Store {
	getInitialState() {
		return localStorage['preferences'] ? JSON.parse(localStorage['preferences']) : {
			userName: 'Tony',
			fontSize: 'small'
		}
	}

	__onDispatch(action) {
		switch (action.type) {
			case UPDATE_USERNAME:
				this.__state.userName = action.value
				break
			case UPDATE_FONT_SIZE_PREFERENCE:
				this.__state.fontSize = action.value
				break
			default:
				return
		}
		this.__emitChange()
	}

	getUserPreferences() {
		return this.__state
	}
}

const controlPanelDispatcher = new Dispatcher()

document.getElementById('userNameInput').addEventListener('input', ({target}) => {
	controlPanelDispatcher.dispatch(userNameUpdateAction(target.value))
})

document.forms.fontSizeForm.fontSize.forEach(e => {
	e.addEventListener('change', ({target}) => {
		controlPanelDispatcher.dispatch(fontSizePreferenceUpdateAction(target.value))
	})
})

const userPreferenceStore = new UserPreferenceStore(controlPanelDispatcher)
userPreferenceStore.addListener(state => {
	console.info('The current state is...', state)
	render(state);
});

const render = ({userName, fontSize}) => {
	document.getElementById('userName').innerText = userName
	document.getElementsByClassName('container')[0].style.fontSize = fontSize === 'small' ? '16px' : '24px'
	document.forms.fontSizeForm.fontSize.value = fontSize
}

render(userPreferenceStore.getUserPreferences())
