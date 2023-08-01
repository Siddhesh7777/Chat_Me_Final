import './App.css';
import { Route, Switch } from "react-router-dom";
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';
// import ChatProvider from './context/ChatProvider';




function App() {
  return (
    <div className='App'>
     <Switch>
            <Route path='/chats'>
                <Chatpage/>
            </Route>
            <Route path='/'>
                <Homepage></Homepage>
            </Route>
     </Switch>
    </div>
  );
}

export default App;
