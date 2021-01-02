import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'

const Card = styled.div`
    transition: box-shadow .3s;
    border: 1px solid #efefef;
    background: #fff;
    text-align: center;

    &:hover {
        box-shadow: 0 0 11px rgba(33,33,33,.2);
    }
`

const TodoTitle = styled.div`
    padding: 20px 0 10px 0;
`

const LinkWrapper = styled.div`
    margin: 30px 0 20px 0;
    height: 50px;
    
    a {
        color: #fff;
        background: #000;
        border-radius: 4px;
        padding: 10px 40px;
        border: 10px 50px;
        width: 70%;
        text-decoration: none;
    }
`

// TODO: Change the link wrapper to the entire card and the View Task button to be delete instead

const Todo = (props) => {
    // console.log(props)
    return (
        <Card>
            <TodoTitle>{props.attributes.title}</TodoTitle>
            {/* <div className="todo-urgency">{props.attributes.avg_score}</div> */}
            <Button
                style={{
                    margin: 20
                }}
                variant="contained"
                href= {`/todos/${props.attributes.id}`}>
                View Task
            </Button>
        </Card>
    )
}

export default Todo