const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        redirect: { name: "mint", params: { projectID: "sample" } }
      },
      {
        name: "mint",
        path: "project/:projectID/mint",
        props: true,
        component: () => import("pages/ProjectMint.vue"),
        children: [
          {
            name: "mint-checkout",
            path: "checkout",
            component: () => import("pages/MintCheckout.vue")
          }
        ]
      },
      {
        name: "mintTx",
        path: "project/:projectID/mint/tx/:txID",
        props: true,
        component: () => import("pages/MintTx.vue")
      },
      {
        name: "user",
        path: "user/:id",
        props: true,
        component: () => import("pages/User.vue")
      },
      {
        name: "collection",
        path: "collection/:id",
        props: true,
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
      },
      {
        name: "dev-mint",
        path: "mint",
        component: () => import("pages/Mint.vue")
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
