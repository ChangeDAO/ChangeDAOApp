const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/Home.vue"),
      },
      {
        name: "claims",
        path: "claims",
        props: true,
        meta: { requiresWeb3: true },
        component: () => import("pages/Claims.vue"),
      },
      {
        name: "projects",
        path: "projects",
        component: () => import("pages/ProjectList.vue"),
      },
      {
        name: "projects-featured",
        path: "projects/featured",
        component: () => import("pages/ProjectList.vue"),
      },
      {
        name: "project-new",
        path: "projects/new",
        props: true,
        meta: { requiresWeb3: true },
        component: () => import("pages/ProjectEdit.vue"),
      },
      {
        name: "project-view",
        path: "projects/:projectID",
        props: true,
        component: () => import("pages/ProjectEdit.vue"),
      },
      {
        name: "project-edit",
        path: "projects/:projectID/edit",
        props: true,
        component: () => import("pages/ProjectEdit.vue"),
      },
      {
        name: "project-admin",
        path: "projects/:projectID/admin",
        props: true,
        meta: { requiresWeb3: true },
        component: () => import("pages/ProjectAdmin.vue"),
      },
      {
        name: "project-mint",
        path: "projects/:projectID/mint",
        props: true,
        meta: { requiresWeb3: true },
        component: () => import("pages/ProjectMintMVP.vue"),
        // children: [
        //   {
        //     name: "mint-checkout",
        //     path: "checkout",
        //     component: () => import("pages/MintCheckout.vue")
        //   }
        // ]
      },
      {
        name: "mint-tx",
        path: "projects/:projectID/mint/tx/:txID",
        props: true,
        component: () => import("pages/MintTx.vue"),
      },
      {
        name: "signup",
        path: "signup",
        props: true,
        meta: { requiresWeb3: true },
        component: () => import("pages/ChangemakerSignup.vue"),
      },
      {
        name: "admin-deploy",
        path: "admin/deploy",
        meta: { requiresWeb3: true },
        component: () => import("pages/DeploymentManagement.vue"),
      },
      {
        name: "admin-approve",
        path: "admin/approve",
        meta: { requiresWeb3: true },
        component: () => import("pages/ChangemakerManagement.vue"),
      },
      {
        name: "user",
        path: "user/:id",
        props: true,
        component: () => import("pages/User.vue"),
      },
      {
        name: "collection",
        path: "collection/:id",
        props: true,
        component: () => import("pages/Collection.vue"),
      },
      {
        name: "about",
        path: "about",
        component: () => import("pages/About.vue"),
      },
      {
        name: "privacy",
        path: "privacy",
        component: () => import("pages/Privacy.vue"),
      },
      {
        name: "terms",
        path: "terms",
        component: () => import("pages/Terms.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
