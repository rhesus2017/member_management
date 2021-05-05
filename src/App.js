// react
import { Route } from "react-router-dom";

// page
import Home from './page/Home/Home';
import First from './page/First/First';
import Second from './page/Second/Second';
import Third from './page/Third/Third';
import Fourth from './page/Fourth/Fourth';
import Fifth from './page/Fifth/Fifth';
import Login from './page/Login/Login';
import Join from './page/Join/Join';

const App = () => {
  return(
    <div className="react_app">
      <Route path="/" exact={true} component={Home} />
      <Route path="/First" component={First} />
      <Route path="/Second" component={Second} />
      <Route path="/Third" component={Third} />
      <Route path="/Fourth" component={Fourth} />
      <Route path="/Fifth" component={Fifth} />
      <Route path="/Login" component={Login} />
      <Route path="/Join" component={Join} />
    </div>
  )
}

export default App;