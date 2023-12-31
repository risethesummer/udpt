import {} from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout";
import { CreateQuestionPage } from "./question/create.tsx";
import { ViewQuestionPage } from "./question/view.tsx";
import { ListQuestionPage } from "./question/list.tsx";
import { HomePage } from "./home.tsx";
import SignIn from "./sign-in.tsx";
import SignUp from "./sign-up.tsx";
import { LoginGuard } from "../components/login-guard/login-guard.tsx";
import { AccountPage } from "./account.tsx";
import ManageThreads from "./admin/manage-threads/index.tsx";
import ManageCategories from "./admin/manage-categories/index.tsx";
import ManageTags from "./admin/manage-tags/index.tsx";
import MangageAccounts from "./admin/manage-accounts/index.tsx";
const NotFoundPage = () => {
  return <div>404 - Page Not Found</div>;
};
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LoginGuard>
        <Layout />
      </LoginGuard>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/question/create",
        element: <CreateQuestionPage />,
      },
      {
        path: "/question/:id",
        element: <ViewQuestionPage />,
      },
      {
        path: "/question",
        element: <ListQuestionPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
      {
        path: "/admin/manage-threads",
        element: <ManageThreads />,
      },
      {
        path: "/admin/manage-categories",
        element: <ManageCategories />,
      },
      {
        path: "/admin/manage-tags",
        element: <ManageTags/>,
      },
       {
        path: "/admin/manage-accounts",
        element: <MangageAccounts/>,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
]);
