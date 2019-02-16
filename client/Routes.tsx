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
const CreateFood = lazify("pages/Food.Create");

export default withRouter(function Routes({
  location
}: any): React.ReactComponentElement<any> {
  return (
    <React.Suspense fallback={<Loading />}>
      <Switch location={location}>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/foodlog" component={FoodLog} />
        <Route exact path="/foodlog/:day" component={FoodLog} />
        <Route exact path="/foods" component={Foods} />
        <Route exact path="/foods/new" component={CreateFood} />
        <Route
          exact
          path="/foods/:id/edit"
          render={({ match }) => <EditFood id={match.params.id} />}
        />
        <Route render={() => <div>Not Found</div>} />
      </Switch>
    </React.Suspense>
  );
});
