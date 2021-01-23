import React from 'react';
import { Chip } from '@material-ui/core';
import styled from 'styled-components';
import AutosizeInput from 'react-input-autosize';

const Wrapper = styled.div`
    margin-bottom: 20px;

    & > * {
        margin: 2px;
    }
`;

interface Tag {
    id: string
    name: string
    type: string
    attributes: {
        name: string
        todo_id: number
    }
};
interface TagI {
    tags: Tag[]
    handleDelete: (tagId: string, tagName: string) => void
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleKeypress: (e: React.KeyboardEvent<Element>) => void
    inputTag: {
        name: string
        todo_id: string
    }
};

const Tags = ({ tags, handleDelete, handleChange, handleKeypress, inputTag }: TagI) => {
    const tagsDisplayed = tags.slice().sort();
    
    return (
        <Wrapper>
            {
                tags.length > 0 &&
                tagsDisplayed.map( (tag: Tag) => (
                    <Chip size='small' 
                        key={tag.id}
                        label={tag.attributes.name}
                        onDelete={ () => handleDelete(tag.id, tag.attributes.name) }
                    />
                ) )
            }

            <AutosizeInput
                placeholder="Add tag...    "
                placeholderIsMinWidth
                onChange={handleChange}
                onKeyPress={handleKeypress}
                value={inputTag.name}
                inputStyle= {{
                    border: "solid 2px #e0e0e0",
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                    marginLeft: 5,
                    verticalAlign: "middle",
                }}
            />

        </Wrapper>
    );
}

export default Tags;
