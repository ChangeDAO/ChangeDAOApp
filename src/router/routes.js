const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { name: "home", path: "", component: () => import("pages/Index.vue") },
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
