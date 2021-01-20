import React, { Fragment, useState } from 'react';
import { Chip, Tooltip, Popover } from '@material-ui/core';
import styled from 'styled-components';

const Wrapper = styled.div`
    & > * {
        margin: 2px;
    }
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
interface CardTagsI {
    tags: Tag[],
    screenWidth: number,
    handleDelete: (tagId: string, tagName: string) => void
};

const CardTags = ({tags, screenWidth, handleDelete}: CardTagsI) => {
    if (tags.length === 0) return (<Wrapper />);

    const [anchorEl, setAnchorEl] = useState<null | EventTarget & HTMLDivElement>(null);
    const columnWidth: number = (screenWidth - 240) / 5;

    const getNumOfTagsToDisplay = (tags: Tag[], maxWidth: number, lenBtwnChips: number) => {
        let numOfTagsToDisplay = 0, currentLen = tags[0].name.length + lenBtwnChips;
        for (let i = 0; i < tags.length && currentLen < maxWidth; i++) {
            const tagName = tags[i].name;
            currentLen += tagName.length * 16 + lenBtwnChips;
            numOfTagsToDisplay++;
        }
        return numOfTagsToDisplay;
    }

    const tagsDisplayed = tags.slice().sort();
    const numOfTagsToDisplay = getNumOfTagsToDisplay(tagsDisplayed, columnWidth - 70, 14);
    const tagsHidden = tagsDisplayed.splice(numOfTagsToDisplay);

    const handleClick = ({ currentTarget }: React.MouseEvent<HTMLDivElement, MouseEvent>) => { setAnchorEl(currentTarget) };
    const handleClose = () => { setAnchorEl(null) };

    return (
        <Wrapper>
            {tagsDisplayed.map( (tag: Tag) => (
                <Chip size='small' 
                    key={tag.id}
                    label={tag.name}
                    onDelete={ () => handleDelete(tag.id, tag.name)}
                />
            ))}
            {
                tagsHidden.length > 0 &&
                <Fragment>
                    <Tooltip title='Click to view more tags'>
                        <Chip
                            size='small'
                            label='...'
                            onClick={handleClick}
                        />
                    </Tooltip>
                    <Popover
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Wrapper>
                            {
                                tagsHidden.map( (tag: Tag) => (
                                    <Chip size='small' 
                                        key={tag.id}
                                        label={tag.name}
                                        onDelete={ () => handleDelete(tag.id, tag.name)}
                                    />
                                ))
                            }
                        </Wrapper>
                    </Popover>
                </Fragment>
            }
        </Wrapper>
    )
}

export default CardTags;