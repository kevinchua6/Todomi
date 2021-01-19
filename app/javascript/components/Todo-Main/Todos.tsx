import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import Todo from './Todo'
import TodoInput from './TodoInput'
import styled from 'styled-components'
import { Subtasks } from '../Todo-Subtask/Todo'
import debounce from '../../utils/debounce'
import { Responsive, WidthProvider } from "react-grid-layout"
import Navbar from '../Shared/Navbar'
import '../../../assets/stylesheets/grid-styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive);

//Style
const Home = styled.div`
    text-align: center;
    max-width: 100%;
    margin-left: 241px;
    margin-right: auto;
`
const Header = styled.div`
    padding: 100px 100px 10px 100px;

    h1 {
        font-size: 45px;
    }
`
const Subheader = styled.div`
    font-weight: 300;
    font-size: 23px;
    padding-bottom: 10px;
`

export interface RawData {
    data: Todos[],
    included: (Subtask|Tag)[]
}

export interface Todos {
    id: string,
    type: string,
    attributes: {
        title: string,
        done: boolean,
        urgency: number,
        id: number,
        tag: string,
        order: number,
        user_id: number
    },
    relationships: {
        subtasks: {
            data: {
                id: string,
                type: string
            }[]
        },
        tags: {
            data: {
                id: string,
                type: string
            }[]
        }
    }
}

export interface Subtask {
    id: string,
    type: string,
    attributes: {
        text: string,
        done: boolean,
        todo_id: number
    }    
}

export interface Tag {
    id: string,
    type: string,
    attributes: {
        name: string,
        todo_id: number
    }
}

export interface InputTodo {
    title: string,
    done?: boolean,
    id?: number,
    urgency?: number
}

export interface SubtaskLength {
    length: number
}

export interface UserId {
    user_id: number
}

export interface TodosI {
    setSearchInput: React.Dispatch<React.SetStateAction<string>>,
    searchInput: string

    tagsChkbox: any
    setTagsChkbox: React.Dispatch<React.SetStateAction<{}>>
    tags: any[]
    setTags: React.Dispatch<React.SetStateAction<any[]>>
    sidebarAllTodoHandleClick: () => void
}

const Todos = ({setSearchInput, searchInput, tagsChkbox, setTagsChkbox, tags, setTags, sidebarAllTodoHandleClick}: TodosI) => {
    const [todos, setTodos] = useState<Todos[]>([])
    const [inputTodo, setInputTodo] = useState<InputTodo>({ title: "" })
    const [loaded, setLoaded] = useState(false)
    const [userId, setUserId] = useState<number>()

    const getChkboxState = () => {
        // Returns an object like {a:0, b:0, c:0} where a,b,c are tag names
        return tags.map(tag=>tag.attributes.name).reduce( (acc: Object, tag: string) => ({
            ...acc,
            [tag]: tagsChkbox[tag] === undefined ? false : true
        }), {})
    }

    // Runs on first render
    useEffect( () => {
        // Gets user_id of the current session
        axios.get('/user_id')
        .then( (resp) => {
            const user_id: number = resp.data.user_id
            setUserId(user_id)
            // Loads todos from API into `todos` state var
            axios.get('/api/v1/todos')
            .then( resp => {
                const rawData = resp.data
                const todosArr: Todos[] = rawData.data.filter( (todo: Todos) => todo.attributes.user_id === user_id)
                const todoIdArr: number[] = todosArr.map( (todo: Todos) => +todo.id)
                
                setTodos(todosArr)
                setTags(rawData.included.filter( (tag: Tag) => tag.type === 'tag' && todoIdArr.includes(tag.attributes.todo_id) ))
                setLoaded(true)
            })
            .catch( resp => console.log(resp) )
        })
        .catch( resp => console.log(resp) )
    }, [] )

    // Runs when tags is loaded
    useEffect( () => {
        setTagsChkbox(getChkboxState())
    }, [tags])

    const handleDeleteTodo = (todo_id: string, subtasks: Subtasks[]) => {
        const deleteTask = async () => {
            const url = `/api/v1/todos/${todo_id}`
            await axios.delete(url)
            const rawData= (await axios.get('/api/v1/todos')).data
            const todosArr: Todos[] = rawData.data.filter( (todo: Todos) => todo.attributes.user_id === userId)
            const todoIdArr: number[] = todosArr.map( (todo: Todos) => +todo.id)
            
            setTodos(todosArr)
            setTags(rawData.included.filter( (tag: Tag) => tag.type === 'tag' && todoIdArr.includes(tag.attributes.todo_id) ))
        }
        const debouncedDelete = debounce(deleteTask, 200)

        if (subtasks.length !== 0) {
            subtasks.forEach( subtask => {
                const url = `/api/v1/subtasks/${subtask.id}`
                axios.delete(url)
                .then( resp => { debouncedDelete() } )
                .catch( resp => console.log(resp) )
            })
        } else {
            deleteTask()
        }
    }

    const getTodoTags = (todo_id: number) => {
        return tags.filter( tag => tag.attributes.todo_id === todo_id)
    }

    // Sort via ascending order (Add a button to swap the order and drag and drop in the future)
    const grid = todos.slice()
        .filter( (todo: Todos) => {
            const isInSearchInput = todo.attributes.title.includes(searchInput)
            let hasSelectedTag = true
            if (!Object.values(tagsChkbox).every(bool => !bool)) {
                hasSelectedTag = false
                for (const [key, value] of Object.entries(tagsChkbox)) {
                    if (value && getTodoTags(+todo.id).map(tag => tag.attributes.name).includes(key) ) {
                        hasSelectedTag = true
                    }
                }
            }

            return isInSearchInput && hasSelectedTag
        })
        .sort( (a, b) => (a.attributes.id > b.attributes.id ? 1 : -1))
        .map( (todo, index) => {
            const subtaskNo = todo.relationships.subtasks.data.length
            // const height = subtaskNo >= 5 ? 3 : 1
            let height: number
            switch (subtaskNo) {
                case 0:
                    height = 1
                    break
                case 1:
                case 2:
                case 3:
                    height = 2
                    break
                case 4:
                default:
                    height = 3
                    break
            }

            const todo_id: number = +todo.id

            const columnNo = 5
            const x = index % columnNo
            const y = Math.floor(index/columnNo)
            return (
                <div key={todo_id} 
                style={{
                    backgroundColor: "#91c5ff" }}
                data-grid={{x: x, y: y, w: 1, h: height}} >
                <Todo
                    attributes={todo.attributes}
                    handleDeleteTodo={handleDeleteTodo}
                />
                </div>
            )
        }
    )

    const inputTodoHandleKeypress = (e: React.KeyboardEvent<Element>) => {
        if (inputTodo.title !== "" && e.key === 'Enter') {
            axios.post('/api/v1/todos', inputTodo)
            .then (resp => {
                setTodos(todos.concat(resp.data.data))
                setInputTodo({title: ''})
            })
            .catch( resp => console.log(resp) )
        }
    }

    const inputTodoHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInputTodo({title: e.target.value}) }

    const sidebarHandleOnClick = (tagState: React.SetStateAction<{}> ) => { 
        setTagsChkbox({ ...tagsChkbox, ...tagState }) 
        // console.log(tagsChkbox)
    }

    const csrfToken = document.querySelector('[name=csrf-token]').getAttribute('content')
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
    
    return (
        <div>

                <Navbar
                    setSearchInput={setSearchInput}
                    searchInput={searchInput}

                    items={tagsChkbox}
                    allTodoHandleClick={sidebarAllTodoHandleClick}
                    handleClick={sidebarHandleOnClick}
                />
                    <Home>
                        <Header>
                            <h1>Todo App</h1>
                            <Subheader>Simple todo list.</Subheader>
                        </Header>
                        <TodoInput
                            inputTodo = {inputTodo}
                            handleKeypress = {inputTodoHandleKeypress}
                            handleChange = {inputTodoHandleChange}
                        />
                        { 
                            loaded && 
                            <ResponsiveGridLayout
                                rowHeight={190}
                                breakpoints={{lg: 1600, md: 996, sm: 768, xs: 480, xxs: 0}}
                                cols={{lg: 5, md: 5, sm: 5, xs: 4, xxs: 2}}
                            >
                                {grid}
                            </ResponsiveGridLayout>
                        }
                    </Home>
        </div>
    )
}

export default Todos