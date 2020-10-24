// Route Views
import Home from "./views/Home";
import Login from "./views/Login";
import Forgot from "./views/Forgot";
import Password from "./views/Password";
import Share from "./views/Share";
import Admin from "./views/Admin";
import Form from "./views/Form"
import FundDashboard  from "./views/FundDashboard"
import FundLogin  from "./views/FundLogin"
import FundPassword from "./views/FundPassword";

export default [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: '/account/confirm/:verify',
    component: Password
  },
  {
    path: "/forgot/:email",
    component: Forgot
  },
  {
    path: "/share/:id",
    component: Share
  },
  {
    path: "/admin",
    component: Admin
  },
  {
    path: "/form/:id",
    component: Form
  },
  {
    path: "/fundraiser",
    component: FundDashboard
  },
  {
    path: "/fundraiser/login",
    component: FundLogin
  },
  {
    path: '/fundraiser/account/confirm/:verify',
    component: FundPassword
  },
];
