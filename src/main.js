import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import 'babel-polyfill'

import {
  Button,
  Layout,
  Icon,
  Radio,
  Menu,
  Form,
  Input,
  Select,
  Table,
  Row,
  Col,
  Tree,
  DatePicker,
  Popconfirm
} from "ant-design-vue";
import Authorized from "./components/Authorized.vue";
import Auth from "./directives/auth.js";

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Radio);
Vue.use(Menu);
Vue.use(Form);
Vue.use(Input);
Vue.use(Select);
Vue.use(Table);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tree);
Vue.use(DatePicker);
Vue.use(Popconfirm);
Vue.component("Authorized", Authorized);
Vue.use(Auth);

new Vue({
  router,
  render: h => h(App),
}).$mount("#app");
