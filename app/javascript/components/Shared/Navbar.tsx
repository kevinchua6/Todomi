import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, InputBase, Button, Drawer, Checkbox,
    List, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import axios from 'axios'
import clsx from 'clsx'
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark'
import styled from 'styled-components'

const LogoHome = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 1.9rem;
  font-family: 'Montserrat',sans-serif;
  margin-left: 10px;
`

const drawerWidth: number = 240

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            top:0,
            left:0,
            backgroundColor: "rgb(91, 169, 255)",
            zIndex: theme.zIndex.drawer + 1
        },
        drawer: {
            width: drawerWidth,
            marginTop: 60
        },
        drawerPaper: {
            width: drawerWidth,
            backgroundColor: "aliceblue"
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: 115,
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

interface TagStates extends Record<string, boolean> {}

interface NavbarI {
  searchInput: string
  setSearchInput: React.Dispatch<React.SetStateAction<string>>,
  
  items: TagStates,
  handleClick: (tagState: TagStates) => void,
  allTodoHandleClick: () => void
}

const Navbar = ({searchInput, setSearchInput, items, handleClick, allTodoHandleClick}: NavbarI) => {
    const classes = useStyles();
    return (
        <div>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar)}
          >
            <Toolbar style={{
                minHeight: 60,
            }}>
              <LogoHome to="/">
                Todomi
              </LogoHome>

              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  value = {searchInput}
                  placeholder="Search…"
                  classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value) }
                />
              </div>

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
            <List style={{ marginTop: 60 }}>
              <ListItem button key={0} onClick={allTodoHandleClick}>
                  <ListItemIcon>
                    <CollectionsBookmarkIcon />
                  </ListItemIcon>
                  <ListItemText>
                    Show All Todos
                  </ListItemText>
              </ListItem>
              <Divider />
                {
                    Object.entries(items).map(([tag, state], i) => (
                        <ListItem button key={i+1} onClick={() => handleClick( { [tag]: !state } ) }>
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