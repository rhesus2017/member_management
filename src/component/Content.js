// react
import { Route } from "react-router-dom";

// component
import Home from './Home';
import First from './First';
import Second from './Second';
import Third from './Third';
import Fourth from './Fourth';
import Fifth from './Fifth';
import Login from './Login';
import Join from './Join';

// css
import '../css/Content.css';

function Content() {

  return(
    <div className="content">
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

export default Content;