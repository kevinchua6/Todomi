import React, { useState, useEffect, Fragment } from 'react'
import { AppBar, Toolbar, IconButton, InputBase, Button, Drawer, Checkbox,
    List, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios'
import clsx from 'clsx'
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark'

export interface TagStates extends Record<string, boolean> {}

export interface Navbar {
    searchInput: string
    setSearchInput: React.Dispatch<React.SetStateAction<string>>,
    
    items: TagStates,
    handleClick: (tagState: TagStates) => void,
    allTodoHandleClick: () => void
}

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            top:0,
            left:0,
            backgroundColor: "rgb(91, 169, 255)",
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none'
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        title: {
            flexGrow: 1,
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: '80%',
                paddingTop: 5,
                paddingBottom: 5,
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: 1,
        },
        inputRoot: {
            color: 'inherit',
            width: '100%'
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }),
)

const Navbar = (props: Navbar) => {
    const classes = useStyles();
    return (
        <div>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar)}
            >
                <Toolbar style={{
                        minHeight: 60,
                        marginLeft: 250
                }}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            value = {props.searchInput}
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>    props.setSearchInput(e.target.value) }
                        />
                    </div>

                        {/* Add a better way to log out */}
                    <Button
                      style={{
                          position: "absolute",
                          marginRight: 25,
                          right: 10,
                          backgroundColor: "#cbe4ff"
                      }}
                      variant="contained"
                      onClick={ () => { axios.delete(`/users/sign_out`)
                      .then(resp=>window.location.reload(false) )
                      .catch(res=>window.location.reload(false)) }}>
                              Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="permanent"
                anchor="left"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >

                <List>
                    <ListItem button key={0} onClick={props.allTodoHandleClick}>
                        <ListItemIcon>
                          <CollectionsBookmarkIcon />
                        </ListItemIcon>
                        <ListItemText>
                          Show All Todos
                        </ListItemText>
                    </ListItem>
                    <Divider />
                    {
                        Object.entries(props.items).map(([tag, state], i) => (
                            <ListItem button key={i+1} onClick={() => props.handleClick( { [tag]: !state } ) }>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={state}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={tag} />
                            </ListItem>
                        ))
                    }
                </List>
            </Drawer>

        </div>
    );
}
export default Navbar