import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import styled from 'styled-components'

const Card = styled.div`
    border: 1px solid #efefef;
    background: #fff;
    text-align: center;
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
        padding: 10px 50px;
        border: 10px 50px;
        width: 100%;
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
            <LinkWrapper>
                <Link to={`/todos/${props.attributes.id}`}>View Task</Link>
            </LinkWrapper>
        </Card>
    )
}

export default Todo