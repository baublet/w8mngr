import * as React from "react";
import lazify from "client/helpers/lazifyRoute";
import Loading from "client/components/Loading/Primary";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router-dom";
import EditActivityPage from "./components/Activity/EditActivityPage";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
export { history };

const Home = lazify("pages/Home");
const Register = lazify("components/User/RegisterPage");
const Logout = lazify("components/User/LogoutPage");
const Login = lazify("components/User/LoginPage");
const FoodLog = lazify("components/FoodEntry/FoodLogPage");
const Foods = lazify("components/Food/FoodsPage");
const EditFood = lazify("components/Food/EditFoodPage");
const NewFood = lazify("components/Food/NewFoodPage");
const Activity = lazify("components/Activity/ActivityPage");
const NewActivity = lazify("components/Activity/NewActivityPage");
const Activities = lazify("components/Activity/ActivitiesPage");
const ActivitiesSearchPage = lazify("components/Activity/ActivitiesSearchPage");

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
          path="/food/new"
          render={props => <NewFood {...props} />}
        />
        <Route
          exact
          path="/food/:id/edit"
          render={({ match }) => <EditFood id={match.params.id} />}
        />
        <Route
          exact
          path="/activity/new"
          render={props => <NewActivity {...props} />}
        />
        <Route
          exact
          path="/activity/:id"
          render={({ match }) => <Activity id={match.params.id} />}
        />
        <Route
          exact
          path="/activities"
          render={props => <Activities {...props} />}
        />
        <Route
          exact
          path="/activities/search"
          render={props => <ActivitiesSearchPage {...props} />}
        />
        <Route
          exact
          path="/activity/:id/edit"
          render={({ match, history }) => (
            <EditActivityPage id={match.params.id} history={history} />
          )}
        />
        <Route render={() => <div>Not Found</div>} />
      </Switch>
    </React.Suspense>
  );
});
