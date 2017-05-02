import {generate as id} from 'shortid'
import {Dispatcher, ReduceStore} from './flux'

const tasksDispatcher = new Dispatcher()

// action creators
const CREATE_TASK = 'CREATE_TASK'
const COMPLETE_TASK = 'COMPLETE_TASK'
const SHOW_TASKS = 'SHOW_TASKS'

const createNewTaskAction = content => {
	return {
		type: CREATE_TASK,
		value: content
	}
}
const showTaskAction = shouldShow => {
	return {
		type: SHOW_TASKS,
		value: shouldShow
	}
}
const completeTaskAction = (id, completed) => {
	return {
		type: COMPLETE_TASK,
		id,
		value: completed
	}
}

class TasksStore extends ReduceStore {
	getInitialState() {
		return {
			tasks: [{
				id: id(),
				content: 'Task 1',
				completed: false
			}, {
				id: id(),
				content: 'Task 2',
				completed: false
			}, {
				id: id(),
				content: 'Task 3',
				completed: false
			}, {
				id: id(),
				content: 'Task 4',
				completed: true
			}],
			showCompleted: true
		}
	}
	getState() {
		return this.__state
	}
	reduce(state, action) {
		console.log('reducing...', state, action)
		let newState = state
		switch (action.type) {
			case CREATE_TASK:
				newState = {
					...state,
					tasks: [...state.tasks]
				}
				newState.tasks.push({
					id: id(),
					content: action.value,
					completed: false
				})
				break
			case SHOW_TASKS:
				newState = {
					...state,
					tasks: [...state.tasks],
					showCompleted: action.value
				}
				break
			case COMPLETE_TASK:
				newState = {
					...state,
					tasks: [...state.tasks]
				}
				const matchedTaskIndex = newState.tasks.findIndex(task => task.id === action.id)
				if (matchedTaskIndex > -1) {
					newState.tasks[matchedTaskIndex] = {
						...newState.tasks[matchedTaskIndex],
						completed: action.value
					}
				}
				break
		}
		return newState
	}
}

const TaskComponent = ({content, completed, id}) => (
	`
	<section>
		${content} <input type="checkbox" name="taskCompleteCheck" data-taskid=${id} ${completed ? "checked" : ""} />
	</section>
	`
)

// hack to revert to last state
document.forms.undo.addEventListener('submit', e => {
	e.preventDefault()
	tasksStore.revertLastState()
})

const render = () => {
	const tasksSection = document.getElementById('tasks')
	const state = tasksStore.getState()
	const rendered = state.tasks.filter(task => (
		state.showCompleted ? true : !task.completed
	)).map(TaskComponent).join('')
	tasksSection.innerHTML = rendered
	document.getElementById('showCompleted').checked = state.showCompleted
	document.getElementsByName('taskCompleteCheck').forEach(e => {
		e.addEventListener('change', e => {
			const id = e.target.attributes['data-taskid'].value
			const checked = e.target.checked
			tasksDispatcher.dispatch(completeTaskAction(id, checked))
		})
	})
}

document.forms.newTask.addEventListener('submit', e => {
	e.preventDefault()
	const name = e.target.newTaskName.value
	if (name) {
		tasksDispatcher.dispatch(createNewTaskAction(name))
		e.target.newTaskName.value = null
	}
})
document.getElementById('showCompleted').addEventListener('change', ({target}) => {
	tasksDispatcher.dispatch(showTaskAction(target.checked))
})


const tasksStore = new TasksStore(tasksDispatcher)
tasksDispatcher.dispatch('TEST_TASK_DISPATCH')
tasksStore.addListener(() => {
	render()
})
render()
