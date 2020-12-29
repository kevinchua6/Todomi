import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'

const Card = styled.div `
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 4px;
    padding: 20px;
    margin: 0 20px 20px 0;
`

const Title = styled.div `
    padding: 0 0 20px 0;
    font-size: 18px;
`
const RatingContainer = styled.div `
    display: flex;
    flex-direction: row;
`
const Description = styled.div `
    padding: 0 0 20px 0;
    font-size: 14px;
`
const Field = styled.div`
    border-radius: 4px;

    input {
        min-height: 50px;
        border-radius: 4px;
        border: 1px solid #e6e6e6;
        margin: 0 0 12px 0;
        padding: 12px;
        width: 94%;
    }

    textarea {
        width: 100%;
        min-height: 80px;
        border-radius: 4px;
        border: 1px solid #e6e6e6;
        margin: 12px 0;
        padding: 12px;
    }
`
const Subtask = (props) => {
    const [todo, setTodo] = useState({})
    const [subtasks, setSubtasks] = useState([])
    const [loaded, setLoaded] = useState(false)

    // console.log(props.match.params.todo_id)
    useEffect( () => {
        const url = `/api/v1/todos/${props.match.params.todo_id}`
        
        axios.get(url)
        .then( 
            resp => { 
                setTodo(resp.data.data.attributes) 
                // todo has {done:false, id: 1, title: "buy milk", urgency:3}
                setSubtasks(resp.data.data.relationships.subtasks)
                // subtasks are an array of objects with [{id:"1", type:"subtask"}]
                setLoaded(true)
            }
        )
        .catch( resp => console.log(resp) )
    }, [])


    const handleChange = (e) => {
        setTodo({title: e.target.value})
    }

    useEffect( () => {
        if (loaded) {
            const csrfToken = document.querySelector('[name=csrf-token]').content
            axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken
    
            const url = `/api/v1/todos/${props.match.params.todo_id}`
            
            axios.patch(url, {title: todo.title})
            .then( 
                resp => { 
                    // setTodo(resp.data.data.attributes) 
                    // // todo has {done:false, id: 1, title: "buy milk", urgency:3}
                    // setSubtasks(resp.data.data.relationships.subtasks)
                    // // subtasks are an array of objects with [{id:"1", type:"subtask"}]
                    // setLoaded(true)
                    console.log(resp)
                }
            )
            .catch( resp => console.log(resp) )
        }

    }, [todo])


    return (
        <div>
        {
            loaded && 
            <Field>
                <input onChange={handleChange} 
                value={todo.title} 
                type="text" 
                name="title" />
                
            </Field>
        }
        </div>
    )
}

export default Subtask