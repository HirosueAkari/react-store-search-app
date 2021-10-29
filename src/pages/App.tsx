import 'App.scss'
import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles"
import { Link } from 'react-router-dom'

function App({ children }: { children: React.ReactNode }): JSX.Element {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const styles = makeStyles((theme: Theme) =>
    createStyles({
      appBar: {
        zIndex: theme.zIndex.drawer + 1
      },
      drawer: {
        flexShrink: 0
      },
      list: {
        width: 100 + '%'
      },
      link: {
        textDecoration: 'none',
        color: 'black'
      }
    })
  )

  return (
    <div>
      <AppBar position="fixed" className={styles().appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <p className="title">店舗検索</p>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        className={styles().drawer}
      >
        <List className={styles().list}>
          <Link to="/free" className={styles().link}>
            <ListItem button>
              <ListItemText primary={'店名 / 住所 / フリーワード'} />
            </ListItem>
          </Link>
          <Link to="/pref" className={styles().link}>
            <ListItem button>
              <ListItemText primary={'都道府県'} />
            </ListItem>
          </Link>
          <Link to="/conditions" className={styles().link}>
            <ListItem button>
              <ListItemText primary={'条件つき'} />
            </ListItem>
          </Link>
          <Link to="/location" className={styles().link}>
            <ListItem button>
              <ListItemText primary={'現在地から'} />
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <main>{children}</main>
    </div>
  )
}

export default App;
