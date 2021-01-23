import React, { useState, useEffect, Fragment }  from 'react';
import { Route, Switch } from 'react-router-dom';
import Todos from './Todo-Main/Todos';
import axios from 'axios';
import Todo from './Todo-Subtask/Todo';

interface Tag {
    id: string
    type: string
    name: string
    attributes: {
        name: string
        todo_id: number
    }
};

interface RawData {
    data: Todos[]
    included: (Subtask|Tag)[]
};

interface Todos {
    id: string
    type: string
    attributes: {
        title: string
        done: boolean
        urgency: number
        id: number
        tag: string
        order: number
		user_id: number
        subtaskno: number
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

interface Subtask {
    id: string
    type: string
    attributes: {
        text: string
        done: boolean
        todo_id: number
    }    
};

const App = () => {
    const [searchInput, setSearchInput] = useState("");
    const [tagsChkbox, setTagsChkbox] = useState({});
    const [tags, setTags] = useState<Tag[]>([]);

    const [loaded, setLoaded] = useState(false);
	const [userId, setUserId] = useState<number>();
	const [todos, setTodos] = useState<Todos[]>([]);
	
	const [currentTab, setCurrentTab] = useState('Homepage');
	
    const handleTagDelete = (tagId: string, tagName: string) => {
        axios.delete(`/api/v1/tags/${tagId}`)
            .then(resp => {
                const newTagsChkbox = { ...tagsChkbox };
                delete newTagsChkbox[tagName];
                setTagsChkbox(newTagsChkbox);
                setTags(tags.filter( (tag: Tag) => tag.id !== tagId) );
            });
	};
	
	// Returns an object like {a:0, b:0, c:0} where a,b,c are tag names
	const getChkboxState = () => tags
		.map(tag => tag.attributes.name)
		.reduce( (acc: Object, tag: string) => ({
			...acc,
			[tag]: tagsChkbox[tag] === undefined ? false : tagsChkbox[tag]
		}), {} );

    // Runs when tags is loaded
    useEffect( () => {
        setTagsChkbox(getChkboxState());
	}, [tags] );
	
    const sidebarAllTodoHandleClick = () => { 
        const newTagsChkbox = {};
        for (const [key, value] of Object.entries(tagsChkbox)) {
            newTagsChkbox[key] = false;
        }
        setTagsChkbox(newTagsChkbox);
    }
    const sidebarHandleOnClick = (tagState: React.SetStateAction<{}>) => { 
        setTagsChkbox({ ...tagsChkbox, ...tagState });
	};
	
	// Runs on first render
	useEffect( () => {
		// Gets user_id of the current session
		axios.get('/user_id')
			.then( (resp) => {
				const user_id: number = resp.data.user_id;
				setUserId(user_id);
				// Loads todos from API into `todos` state var
				axios.get('/api/v1/todos')
					.then( resp => {
						const rawData = resp.data;
						const todosArr: Todos[] = rawData.data.filter( (todo: Todos) => todo.attributes.user_id === user_id );
						const todoIdArr: number[] = todosArr.map( (todo: Todos) => +todo.id );
						
						setTodos(todosArr);
						setTags(rawData.included.filter( (tag: Tag) => tag.type === 'tag' && todoIdArr.includes(tag.attributes.todo_id) ));
						setLoaded(true);
					})
					.catch( resp => console.log(resp) );
			} )
			.catch( resp => console.log(resp) );
	}, [] );

    return (
			<Switch>
				{ loaded &&
					<Route exact path="/" render={(props) => ( 
						<Todos {...props} 
							setSearchInput={setSearchInput}
							searchInput={searchInput} 

							tagsChkbox={tagsChkbox}
							setTagsChkbox={setTagsChkbox}
							tags={tags}
							setTags={setTags}
							handleTagDelete={handleTagDelete}

							sidebarAllTodoHandleClick={sidebarAllTodoHandleClick}
							sidebarHandleOnClick={sidebarHandleOnClick}
							
							loaded={loaded}
							userId={userId}
							todos={todos}
							setTodos={setTodos}
							currentTab={currentTab}
							setCurrentTab={setCurrentTab}
						/>
					)} />
				}
				<Route exact path="/todos/:todo_id" render={(props) => (
					<Todo {...props} 
						setSearchInput={setSearchInput}
						searchInput={searchInput}

						tagsChkbox={tagsChkbox}
						setTagsChkbox={setTagsChkbox}
						tags={tags}
						setTags={setTags}
						handleTagDelete={handleTagDelete}

						sidebarAllTodoHandleClick={sidebarAllTodoHandleClick}
						sidebarHandleOnClick={sidebarHandleOnClick}

						todos={todos}
						setTodos={setTodos}

						currentTab={currentTab}
						setCurrentTab={setCurrentTab}
					/>
				)} />
			</Switch>
    );
}
export default App;
