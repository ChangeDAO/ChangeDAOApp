const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/Home.vue")
      },
      {
        name: "claims",
        path: "claims",
        props: true,
        component: () => import("pages/Claims.vue")
      },
      {
        name: "project-new",
        path: "project/new",
        props: true,
        component: () => import("pages/ProjectEdit.vue")
      },
      {
        name: "project-edit",
        path: "project/:projectID/edit",
        props: true,
        component: () => import("pages/ProjectEdit.vue")
      },
      {
        name: "project-admin",
        path: "project/:projectID/admin",
        props: true,
        component: () => import("pages/ProjectAdmin.vue")
      },
      {
        name: "mint",
        path: "project/:projectID/mint",
        props: true,
        component: () => import("pages/ProjectMintMVP.vue")
        // children: [
        //   {
        //     name: "mint-checkout",
        //     path: "checkout",
        //     component: () => import("pages/MintCheckout.vue")
        //   }
        // ]
      },
      {
        name: "mintTx",
        path: "project/:projectID/mint/tx/:txID",
        props: true,
        component: () => import("pages/MintTx.vue")
      },
      {
        name: "cm-signup",
        path: "signup",
        props: true,
        component: () => import("pages/ChangemakerSignup.vue")
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
        name: "admin-deploy",
        path: "admin/deploy",
        component: () => import("pages/DeploymentManagement.vue")
      },
      {
        name: "admin-approve",
        path: "admin/approve",
        component: () => import("pages/ChangemakerManagement.vue")
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
