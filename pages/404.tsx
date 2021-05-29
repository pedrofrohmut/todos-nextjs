import { ReactElement } from "react"

const NotFoundPage = (): ReactElement => {
  return (
    <div className="pageContainer centerChildren flexDirectionColumn">
      <h1>404 | Page Not Found</h1>
      <p>We sorry, but the page you are trying to reach could not be found</p>
      <p>Try checking out your URL or the URL may have changed</p>
    </div>
  )
}

export default NotFoundPage
