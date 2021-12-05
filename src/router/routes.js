const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        redirect: { name: "mint", params: { id: "sample" } }
      },
      {
        name: "mint",
        path: "project/:id/mint",
        component: () => import("pages/ProjectMint.vue")
      },
      {
        name: "user",
        path: "user/:id",
        component: () => import("pages/User.vue")
      },
      {
        name: "collection",
        path: "collection/:id",
        component: () => import("pages/Collection.vue")
      },
      {
        name: "about",
        path: "about",
        component: () => import("pages/About.vue")
      },
      {
        name: "privacy",
        path: "privacy",
        component: () => import("pages/Privacy.vue")
      },
      {
        name: "terms",
        path: "terms",
        component: () => import("pages/Terms.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
