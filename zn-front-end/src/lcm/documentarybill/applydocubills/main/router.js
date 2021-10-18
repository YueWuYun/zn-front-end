import { asyncComponent } from "nc-lightapp-front";
import List from "../list";
import pullBillList from "../pullBillList";

const Card = asyncComponent(() =>
  import(
    /* webpackChunkName: "lcm/documentarybill/applydocubills/card" */ /* webpackMode: "eager" */ "../card"
  )
);

const routes = [
  {
    path: "/",
    component: List,
    exact: true,
  },
  {
    path: "/list",
    component: List,
  },
  {
    path: "/pullBillList",
    component: pullBillList,
  },
  {
    path: "/card",
    component: Card,
  },
];

export default routes;
