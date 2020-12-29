import React from 'react'
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

const Subtask = (props) => {
    // const {score, title, description} = props.attributes
    
    return (
        <Card>
            <RatingContainer>
                <Rating score={score}/>
            </RatingContainer>
            <Title>{title}</Title>
            <Description>{description}</Description>
        </Card>
    )
}

export default Subtask