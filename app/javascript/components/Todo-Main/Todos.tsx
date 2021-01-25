import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import Todo from './Todo';
import TodoInput from './TodoInput';
import styled from 'styled-components';
import debounce from '../../utils/debounce';
import { Responsive, WidthProvider } from "react-grid-layout";
import Navbar from '../Shared/Navbar';
import '../../../assets/stylesheets/grid-styles.css';
import { dark } from '@material-ui/core/styles/createPalette';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Home = styled.div`
    text-align: center;
    max-width: 100%;
    margin-left: 241px;
    margin-right: auto;
`;
const Header = styled.div`
    padding: 100px 100px 10px 100px;

    h1 {
        font-size: 70px;
    }
    font-family: 'Montserrat',sans-serif;
`;
const Subheader = styled.div`
    font-weight: 300;
    font-size: 23px;
    padding-bottom: 30px;
`;
const Notifications = styled.div`
    font-family: 'Montserrat',sans-serif;
    font-size: 20px;
    padding-top: 20px;
`

export interface Todos {
    id: string
    type: string
    attributes: {
        title: string
        done: boolean
        // urgency: number
        id: number
        tag: string
        // order: number
        user_id: number
        subtaskno: number
        date: string
    },
    relationships: {
        subtasks: {
            data: {
                id: string
                type: string
            }[]
        },
        tags: {
            data: {
                id: string
                type: string
            }[]
        }
    }
};

export interface Subtask {
    id: string
    type: string
    attributes: {
        text: string
        done: boolean
        todo_id: number
    }    
};
export interface Tag {
    id: string
    type: string
    attributes: {
        name: string
        todo_id: number
    }
};

export interface InputTodo {
    title: string
    done?: boolean
    id?: number
    date?: string
};

export interface SubtaskLength {
    length: number
};

export interface UserId {
    user_id: number
};

export interface TodosI {
    setSearchInput: React.Dispatch<React.SetStateAction<string>>
    searchInput: string
    tagsChkbox: Record<string, boolean>
    setTagsChkbox: React.Dispatch<React.SetStateAction<{}>>
    tags: Tag[]
    setTags: React.Dispatch<React.SetStateAction<any[]>>
    handleTagDelete: (tagId: string, tagName: string) => void
    sidebarAllTodoHandleClick: () => void
    sidebarHandleOnClick: (tagState: React.SetStateAction<{}>) => void
    loaded: boolean
    userId: number
    todos: Todos[]
    setTodos: React.Dispatch<React.SetStateAction<Todos[]>>
    currentTab: string
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}

const Todos = ({
    setSearchInput, 
    searchInput, 
    tagsChkbox, 
    setTagsChkbox, 
    tags, 
    setTags, 
    handleTagDelete,
    sidebarAllTodoHandleClick, 
    sidebarHandleOnClick,
    loaded,
    userId,
    todos,
    setTodos,
    currentTab,
    setCurrentTab
}: TodosI) => {

    const setToStartOfDay = (date: Date) => {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    }

    const todayDate = new Date();
    
    const [inputTodo, setInputTodo] = useState<InputTodo>({ title: "", date: null });


	useEffect( () => {
        axios.get('/api/v1/todos')
            .then( resp => {
                const rawData = resp.data;
                const todosArr: Todos[] = rawData.data.filter( (todo: Todos) => todo.attributes.user_id === userId );
                setTodos(todosArr);
            })
            .catch( resp => console.log(resp) );
	}, [] );

    const handleCompleteTodo = (todo_id: string) => {
        axios.patch(`/api/v1/todos/${todo_id}`, {done: true})
            .then( resp => {
                setTodos( todos.map(todo => 
                    todo.id === todo_id
                        ? {...todo, attributes: {...todo.attributes, done: true} }
                        : todo
                    )
                )
            })
            .catch( resp => console.log(resp) );
    }

    const handleRestoreTodo = (todo_id: string) => {
        axios.patch(`/api/v1/todos/${todo_id}`, {done: false})
            .then( resp => {
                setTodos( todos.map(todo => 
                    todo.id === todo_id
                        ? {...todo, attributes: {...todo.attributes, done: false} }
                        : todo
                    )
                )
            })
            .catch( resp => console.log(resp) );
    }

    const handleDeleteTodo = (todo_id: string, subtasks: Subtask[]) => {
        const deleteTask = async () => {
            await axios.delete(`/api/v1/todos/${todo_id}`);
            const rawData = (await axios.get('/api/v1/todos')).data;
            const todosArr: Todos[] = rawData.data.filter( (todo: Todos) => todo.attributes.user_id === userId );
            const todoIdArr: number[] = todosArr.map( (todo: Todos) => +todo.id );
            
            setTodos(todosArr);
            setTags(rawData.included.filter( (tag: Tag) => tag.type === 'tag' && todoIdArr.includes(tag.attributes.todo_id) ));
        }
        const debouncedDelete = debounce(deleteTask, 200);

        if (subtasks.length !== 0) {
            subtasks.forEach( subtask => {
                const url = `/api/v1/subtasks/${subtask.id}`;
                axios.delete(url)
                    .then( resp => { debouncedDelete() } )
                    .catch( resp => console.log(resp) );
            })
        } else {
            deleteTask();
        }
    };

    const getTodoTags = (todo_id: number) => {
        return tags.filter( (tag: Tag) => tag.attributes.todo_id === todo_id );
    };

    // Sort via ascending order (Add a button to swap the order and drag and drop in the future)
    
    const noTodosInSection = (todos: Todos[], section: string) => { 
        return todos.filter( (todo: Todos) => 
            section === "Homepage"
                ? !todo.attributes.done
                : todo.attributes.done
         ).length
    }

    const noHomepageTodos = noTodosInSection(todos, "Homepage");
    const noCompletedTodos = noTodosInSection(todos, "Completed Tasks");

    const grid = todos
        .filter( (todo: Todos) => {
            const tabBool = currentTab === "Homepage" 
                ? !todo.attributes.done
                : currentTab === "Completed Tasks"
                ? todo.attributes.done
                : false

            const isInSearchInput = todo.attributes.title.includes(searchInput);
            let hasSelectedTag = true;
            if (!Object.values(tagsChkbox).every(bool => !bool)) {
                hasSelectedTag = false;
                for (const [key, value] of Object.entries(tagsChkbox)) {
                    if (value && getTodoTags(+todo.id).map(tag => tag.attributes.name).includes(key)) {
                        hasSelectedTag = true;
                    }
                }
            }
            return isInSearchInput && hasSelectedTag && tabBool;
        } )
        .sort( (a, b) => (a.attributes.id > b.attributes.id ? 1 : -1) )
        .map( (todo, index) => {
            const subtaskNo: number = todo.attributes.subtaskno;
            let isDue: boolean;
            const dueDate: string = todo.attributes.date;
            const dueDateObj: Date = new Date(dueDate);

            if (dueDate) {
                setToStartOfDay(dueDateObj);
                isDue = dueDateObj <= todayDate;
            } else {
                isDue = false;
            }

            let height: number;
            switch (subtaskNo) {
                case null:
                case 0:
                    height = 1;
                    break;
                case 1:
                case 2:
                case 3:
                    height = 2;
                    break;
                case 4:
                default:
                    height = 3;
                    break;
            }
            const todo_id: number = +todo.id;

            const columnNo = 5;
            const x = index % columnNo;
            const y = Math.floor(index/columnNo);
            return (
                <div
                    key={todo_id} 
                    style={{ backgroundColor: isDue ? "#ff8c8c" : "#91c5ff", borderRadius: 5 }}
                    data-grid={{ x: x, y: y, w: 1, h: height }}
                >
                    <Todo
                        attributes={todo.attributes}
                        handleCompleteTodo={handleCompleteTodo}
                        handleRestoreTodo={handleRestoreTodo}
                        handleDeleteTodo={handleDeleteTodo}
                        tags={tags}
                        setTagsChkbox={setTagsChkbox}
                        tagsChkbox={tagsChkbox}
                        handleTagDelete={handleTagDelete}
                        isDue={isDue}
                        dueDate={dueDate}
                    />
                </div>
            );
        });

    const inputTodoHandleKeypress = (e: React.KeyboardEvent<Element>) => {
        if (inputTodo.title !== "" && e.key === 'Enter') {
            console.log(inputTodo)
            axios.post('/api/v1/todos', inputTodo)
                .then(resp => {
                    setTodos(todos.concat(resp.data.data));
                    setInputTodo({...inputTodo, title: ''});
                })
                .catch( resp => console.log(resp) );
        }
    };

    const inputTodoHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInputTodo({...inputTodo, title: e.target.value}); };

    const csrfToken = document.querySelector('[name=csrf-token]').getAttribute('content');
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
    
    return (
        <Fragment>
            <Navbar
                setSearchInput={setSearchInput}
                searchInput={searchInput}

                items={tagsChkbox}
                allTodoHandleClick={sidebarAllTodoHandleClick}
                handleClick={sidebarHandleOnClick}

                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            />
            <Home>
                <Header>
                    <h1>Todomi</h1>
                    <Subheader>Grid style Todolist.</Subheader>
                </Header>
                <TodoInput
                    inputTodo = {inputTodo}
                    handleKeypress = {inputTodoHandleKeypress}
                    handleChange = {inputTodoHandleChange}
                />
                { 
                    currentTab === "Homepage" && noHomepageTodos === 0
                    ? <Notifications> You have no Tasks! Create some above! </Notifications>
                    : currentTab === "Completed Tasks" && noCompletedTodos === 0
                    ? <Notifications> You have no Completed Tasks! Go accomplish something! </Notifications>
                    : loaded
                    ?   <ResponsiveGridLayout
                            rowHeight={190}
                            breakpoints={{lg: 1900, md: 996, sm: 768, xs: 480, xxs: 0}}
                            cols={{lg: 5, md: 5, sm: 5, xs: 4, xxs: 2}}
                        >
                            {grid}
                        </ResponsiveGridLayout>
                    : null

                }
            </Home>
        </Fragment>
    );
}

export default Todos;