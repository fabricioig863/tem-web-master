import { Switch } from 'react-router-dom';
import Route from './Route'; 

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Patients from '../pages/Patients';
import New from '../pages/New';

export default function Routes(){
  return(
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route path="/register" component={SignUp} /> 
      
      <Route exact path="/dashboard" component={Dashboard} isPrivate/> 
      <Route exact path="/profile" component={Profile} isPrivate/>
      <Route exact path="/patients" component={Patients} isPrivate/> 
      <Route exact path="/new" component={New} isPrivate/> 
      <Route exact path="/new/:id" component={New} isPrivate/> 

    </Switch>
  )
}