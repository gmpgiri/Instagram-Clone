import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import  firebase  from 'firebase';
import { makeStyles, Modal, Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return ({
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  });
}
const auth = firebase.auth();
const db = firebase.firestore();

const useStyles = makeStyles((themes)=> ({
  paper : {
    position: 'absolute',
    width :400,
    backgroundColor : themes.palette.background.paper,
    border: '2px solid #000',
    boxShadow: themes.shadows[5],
    padding: themes.spacing(2,4,3),
  }
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn,setOpenSignIn] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if(authUser) {
        console.log(authUser);
        setUser(authUser);

        if(authUser.displayName) {

        } else {
          return authUser.updateProfile({
              displayName: username,
          })
        }

      } else {
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }

  }, [user, username]);



  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=> ({
        id: doc.id,
        post : doc.data()
      })));
    })
  }, [posts])  

 const signUp = (event) => {
  event.preventDefault();
  auth
  .createUserWithEmailAndPassword(email, password)
  .catch((err)=> alert(err.message))

  setOpen(false);
 }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="App">
      <Modal open={open} onClose={()=> setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img
              className="app__headerImage" 
              src="https://banner2.cleanpng.com/20180804/tqu/kisspng-share-icon-file-sharing-computer-icons-android-app-related-wired-pass2phone-apk-5b654990155961.5190932115333646240875.jpg"
              width="100px"
             /> 
           </center>

             <Input 
              placeholder ="username"
              type ="text"
              value = {username}
              onChange = {(e) => setUsername(e.target.value)}
             /> 
             <Input 
              placeholder ="email"
              type ="text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
             /> 
             <Input 
              placeholder ="password"
              type ="password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
             /> 
             <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
          
        </div>
      </Modal>
      {/* Sign in modal */}
      <Modal open={openSignIn} onClose={()=> setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img
              className="app__headerImage" 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
              width="100px"
             /> 
           </center>
             <Input 
              placeholder ="email"
              type ="text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
             /> 
             <Input 
              placeholder ="password"
              type ="password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
             /> 
             <Button type="submit"onClick = {signIn}>Sign In</Button>
        </form>
          
        </div>
      </Modal>
      <div className="app__header">
        <img
        className="app__headerImage" 
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
        width="100px"
        />
       {/*sign up and log out buttons*/}
        {user ? (      
            <Button onClick ={()=>auth.signOut()}> Log Out </Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick ={()=> setOpenSignIn(true)}> Log In </Button>
            <Button onClick ={()=> setOpen(true)}> Sign Up </Button>
          </div>
        )
        }  
      </div>
      
      <div className ="app__posts">
        <div className="app__postsLeft">
          {
                  posts.map(({id, post}) => {
                    return (
                      <Post 
                      key = {id}
                      postId={id}
                      user = {user}
                      username={post.username} 
                      caption={post.caption} 
                      imageUrl={post.imageUrl}
                    />
                    )
                  })
          }
        </div>
        
      </div>
      
          
      {user?.displayName ? (
       <ImageUpload username ={user.displayName}/>
      ): (
        <h3> Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
