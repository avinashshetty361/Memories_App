import { Container, Grow, Grid, Paper,AppBar,TextField,Button } from '@material-ui/core'
import React,{useState} from 'react'
import {useDispatch} from 'react-redux'
import {getPostBySearch} from '../../actions/posts'
import useStyles from './styles';
import Posts from '../Posts/Posts';
import Form from '../Form/Form'
import  Pagination  from '../Pagination'
import { useHistory,useLocation } from 'react-router-dom/' //for search
import ChipInput from 'material-ui-chip-input';

function useQuery(){//as a hook
    return new URLSearchParams(useLocation().search)
}

const Home = () => {
    const[currentId,setCurrentId]=useState(null);
    const dispatch=useDispatch();
     const query=useQuery();
     const history=useHistory();
     const page=query.get('page') || 1;//it will search in url wheter eit has page paramter  or be in first page
     const searchQuery=query.get('searchQuery');
    const classes=useStyles();

    const [search,setSearch]=useState('');
    const [tags,setTags]=useState([]);

    const handleKeyPress=(e)=>{
        if(e.keyCode===13){//keycode 13 means enter key
            searchPost();
        }
    }
  const searchPost=()=>{
    if(search.trim() || tags){
        //dispatch to fetch seatch post
        dispatch(getPostBySearch({search,tags:tags.join(',')}))//here we should convert tags to string because api accepts onlyn string
        history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
    }else{
        history.push('/');
    }
  }

    const handleAdd=(tag)=>{
    setTags([...tags,tag])
    }

    const handleDelete=(tagToDelete)=>{

        setTags(tags.filter((tag)=>tag!==tagToDelete));
        
      }
    //   useEffect(() => {
    //     if(!tags){history.push('/')}
    //     else searchPost(); // If you want to trigger search based on updated tags
    // }, [tags]); // Depend on `tags` so it runs every time it changes
      
    
   
    return (
        <Grow in>
            <Container maxWidth="xl">
                <Grid className={classes.gridContainer} container justifyContent='space-between' alignItems='stretch' spacing={3} >
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                           <TextField name='serach' variant='outlined' label="Search Memories" fullWidth value={search} onChange={(e)=>setSearch(e.target.value)} onKeyPress={handleKeyPress}/>
                        <ChipInput style={{margin:'10px 0'}} value={tags} onAdd={handleAdd} onDelete={handleDelete} label="Search Tags" variant='outlined'/>
                        <Button onClick={searchPost} className={classes.searchButton} variant='contained' color='primary'>SEARCH</Button>
                        </AppBar>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        {(!searchQuery && !tags.length)&& (
                        <Paper  elevation={6}  className={classes.pagination}>
                            <Pagination page={page}/>
                        </Paper>
                        )}
                    </Grid>


                </Grid>
            </Container>

        </Grow>
    )
}

export default Home