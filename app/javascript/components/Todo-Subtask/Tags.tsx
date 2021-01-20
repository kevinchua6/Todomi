import React, { Fragment, useState } from 'react';
import { Chip, Tooltip, Popover } from '@material-ui/core';
import styled from 'styled-components';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const Wrapper = styled.div`
    margin-bottom: 20px;

    & > * {
        margin: 2px;
    }
`;

const InputTag = styled.input`
    width: 70px;
    border: solid 2px #e0e0e0;
    border-radius: 5px;
    background-color: #e0e0e0;
    margin-left: 5px;
    vertical-align: middle;
`;

interface Tag {
    id: string,
    name: string,
    type: string,
    attributes: {
        name: string,
        todo_id: number
    }
};

interface TagI {
    tags: Tag[],
    handleDelete: (tagId: string, tagName: string) => void,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleKeypress: (e: React.KeyboardEvent<Element>) => void,
    inputTag: {
        name: string;
        todo_id: string;
    }
};

const Tags = ({ tags, handleDelete, handleChange, handleKeypress, inputTag }: TagI) => {
    const tagsDisplayed = tags.slice().sort()
    
    return (
        <Wrapper>
            {
                tags.length > 0 &&
                tagsDisplayed.map( (tag: Tag) => (
                    <Chip size='small' 
                        key={tag.id}
                        label={tag.attributes.name}
                        onDelete={ () => handleDelete(tag.id, tag.attributes.name)}
                    />
                ))
            }

            {/* Make it a button that makes this div appear when clicked
            and when clicked elsewhere it disappears
            */}
            {/* Add when hover change color */}

            <InputTag
                placeholder="Add tag..."
                onChange={handleChange}
                onKeyPress={handleKeypress}
                value={inputTag.name}
            />

            {/* <AddCircleOutlineIcon
                style={{
                    verticalAlign: "middle",
                    color: "#828282",
                    cursor: "pointer",

                }}
            /> */}
        </Wrapper>
    );
}

export default Tags;
