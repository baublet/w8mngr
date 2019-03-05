import * as React from "react";
import lazify from "helpers/lazifyRoute";
import Loading from "components/Loading/Primary";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";

const Home = lazify("pages/Home");
const Register = lazify("pages/Register");
const Logout = lazify("pages/Logout");
const Login = lazify("pages/Login");
const FoodLog = lazify("pages/FoodLog");
const Foods = lazify("pages/Foods");
const EditFood = lazify("pages/Food.Edit");
const NewFood = lazify("pages/Food.New");
const NewActivity = lazify("components/Activity/NewActivityPage");
const Activities = lazify("components/Activity/ActivitiesPage");

export default withRouter(function Routes({
  location
}: any): React.ReactComponentElement<any> {
  return (
    <React.Suspense fallback={<Loading />}>
      <Switch location={location}>
        <Route exact path="/" render={props => <Home {...props} />} />
        <Route
          exact
          path="/register"
          render={props => <Register {...props} />}
        />
        <Route exact path="/logout" render={props => <Logout {...props} />} />
        <Route exact path="/login" render={props => <Login {...props} />} />
        <Route exact path="/foodlog" render={props => <FoodLog {...props} />} />
        <Route
          exact
          path="/foodlog/:day"
          render={props => <FoodLog {...props} />}
        />
        <Route exact path="/foods" render={props => <Foods {...props} />} />
        <Route
          exact
          path="/foods/new"
          render={props => <NewFood {...props} />}
        />
        <Route
          exact
          path="/foods/:id/edit"
          render={({ match }) => <EditFood id={match.params.id} />}
        />
        <Route
          exact
          path="/activities"
          render={props => <Activities {...props} />}
        />
        <Route
          exact
          path="/activity/new"
          render={props => <NewActivity {...props} />}
        />
        <Route render={() => <div>Not Found</div>} />
      </Switch>
    </React.Suspense>
  );
});
