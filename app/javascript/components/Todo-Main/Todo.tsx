import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import styled from 'styled-components';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import DoneIcon from '@material-ui/icons/Done';
import Button from '@material-ui/core/Button';
import Subtask from '../Todo-Subtask/Subtask';
import axios from 'axios';
import { Subtasks } from '../Todo-Subtask/Todo';
import TodoSubtask from './TodoSubtask';
import CardTags from './CardTags';

const TodoTitle = styled.div`
    padding: 15px 0 15px 0;
    font-size: 22px;
`;
const Ellipsis = styled.div`
    text-align: left;
    margin: 6px 0 0 30px;
`;
const ButtonPlaceholder = styled.div`
    width: 110px;
    height: 60px;
    margin: 15px;
    margin-left: auto;
    margin-right: auto;
`;

interface Subtask {
    id: string,
    type: string,
    attributes: {
        text: string,
        done: boolean,
        todo_id: number
    }    
};

interface Tag {
    id: string
    name: string
    type: string
    attributes: {
        name: string
        todo_id: number
    }
};

interface TodoI {
    attributes: {
        title: string
        done: boolean
        urgency: number
        id: number
    }
    handleDeleteTodo: (todo_id: string, subtasks: Subtasks[]) => void
    setTagsChkbox: React.Dispatch<React.SetStateAction<{}>>
    tagsChkbox: Record<string, boolean>
};

interface RawData {
    data: {
        data: {
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
            }
            relationships: {
                tags: {
                    data: {
                        id: string
                        type: string
                    }[]
                }
                subtasks: {
                    data: {
                        id: string
                        type: string
                    }[]
                }
            }
        }
        included: (Subtask|Tag)[]
    }
};

const Todo = ( { attributes, handleDeleteTodo, setTagsChkbox, tagsChkbox }: TodoI) => {
    const todo_id: string = "" + attributes.id;
    const [subtasks, setSubtasks] = useState<Subtasks[]>([]);
    const [renderSubtasks, setRenderSubtasks] = useState<JSX.Element[]>([]);
    const [buttonCompleted, setButtonCompleted] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', () => setScreenWidth(window.innerWidth) );

        // Experimenting with async functions to make code look nicer
        (async () => {
            // Get Subtasks for each Todo
            const url = `/api/v1/todos/${todo_id}`;
            const { data: rawData }: RawData = await axios.get(url);
            const newSubtasks: Subtasks[] = rawData.included.filter( (subtask: Subtask) => subtask.type === 'subtask');
            const newTags = rawData.included.filter( (tag: Tag) => tag.type === 'tag')
                .map( (tag: Tag) => ({ 
                    id: tag.id, name: tag.attributes.name 
                }));
            setSubtasks(newSubtasks);
            setTags(newTags);
        })();
    }, []);

    const updateSubtask = (id: string, done: boolean) => {
        setSubtasks(subtasks.map( subtask => 
            subtask.id === id
                ? {...subtask, attributes: {...subtask.attributes, done: !done} }
                : subtask
            )
        )
    }

    useEffect( ()=> {
        const undoneSubtasks: Subtasks[] = subtasks.filter(subtask => !subtask.attributes.done).sort( (a, b) => (a.id > b.id ? 1 : -1))
        const doneSubtasks: Subtasks[] = subtasks.filter(subtask => subtask.attributes.done).sort( (a, b) => (a.id > b.id ? 1 : -1))

        const maxNoSubtask = 6
        setRenderSubtasks([...undoneSubtasks, ...doneSubtasks].map( (subtask, index) => 
            index < maxNoSubtask
            ? (
                <TodoSubtask
                    key={subtask.id}
                    id={subtask.id}
                    todo_id={+todo_id}
                    updateSubtask={updateSubtask}
                    attributes={subtask.attributes}
                />
            )
            : index == maxNoSubtask
            ? ( <Ellipsis key={subtask.id}> ... </Ellipsis> )
            : ( <div key={subtask.id}></div> )
        ))

        // If all the subtasks are done
        if (undoneSubtasks.length === 0) {
            setButtonCompleted(true)
        } else {
            setButtonCompleted(false)
        }

    }, [subtasks])

    const tagHandleDelete = (tagId: string, tagName: string) => {
        axios.delete(`/api/v1/tags/${tagId}`).then(resp => {
                const newTagsChkbox = {...tagsChkbox}
                delete newTagsChkbox[tagName]
                setTagsChkbox(newTagsChkbox)

                setTags(tags.filter( (tag: Tag) => tag.id !== tagId))
            }
        )
    }

    return (
        <div>
            <TodoTitle>{attributes.title}</TodoTitle>
            {/* Todo: Allow the color of the box to be changed */}

            {renderSubtasks}

            <CardTags
                screenWidth={screenWidth}
                tags={tags}
                handleDelete={tagHandleDelete}
            />

            <Link to={`/todos/${attributes.id}`}>
                <Button
                    startIcon={<FormatListNumberedIcon/>}
                    variant="contained"
                    style={{
                        backgroundColor: "rgb(204, 209, 255)",
                        margin: 15,
                        marginLeft: "auto",
                        marginRight: "auto",
                        position: "absolute",
                        bottom: 50,
                        textAlign: "center",
                        left: 0,
                        right: 0,
                        width: "95%",
                        fontWeight: "bold"
                    }}>
                        View Task
                </Button>
            </Link>
            <Button
                style={{
                    backgroundColor: buttonCompleted ? "rgb(186, 255, 187)" : "",
                    margin: 15,
                    marginLeft: "auto",
                    marginRight: "auto",
                    position: "absolute",
                    bottom: 0,
                    textAlign: "center",
                    left: 0,
                    right: 0,
                    width: "95%",
                    fontWeight: "bold"
                }}
                startIcon={<DoneIcon/>}
                disabled={!buttonCompleted}
                variant="contained"
                onClick= {() => handleDeleteTodo(todo_id, subtasks)}>
                    Complete Task
            </Button>
            <ButtonPlaceholder/>
        </div>
    )
}

export default Todo