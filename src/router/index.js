import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import NotFound from "../views/404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () =>
      import(/*webpackChunkName:"user"*/ "../layouts/BasicLayout.vue"),
    children: [
      //dashboard
      {
        path: "/",
        meta: { authority: ["user", "admin"] },
        redirect: "/org/user-list",
      },
      {
        path: "/org",
        name: "org",
        meta: {
          icon: "dashboard",
          title: "组织管理"
        },
        component: { render: h => h("router-view") },
        children: [
          {
            path: "/org/user-list",
            name: "list",
            meta: {
              title: "用户管理"
            },
            component: () =>
              import(
                /*webpackChunkName:"user"*/ "../views/Org/User/UserList.vue"
              )
          },
          {
            path: "/org/user-form",
            name: "form",
            hideInMenu: true,
            meta: {
              title: "编辑用户"
            },
            component: () =>
              import(
                /*webpackChunkName:"user"*/ "../views/Org/User/UserForm.vue"
              )
          },
          {
            path: "/org/dept-list",
            name: "list",
            meta: {
              title: "部门管理"
            },
            component: () =>
              import(
                /*webpackChunkName:"user"*/ "../views/Org/User/UserList.vue"
              )
          }
        ]
      }]
  },
  {
    path: "*",
    name: "404",
    hideInMenu: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
