export default ({markup, css}) => {
  return `<!doctype html>
  <html land="en">
    <head>
      <meta charset="utf-8">
      <title>MERN Skeleton</title>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
      <style>
        a{
          text-decoration: none
        }
      </style>
    </head>
    <body>
    <div id="root">${markup}</div>
    <style id="jss-server-side">${css}</style>
    <script type="text/javascript" src="/dist/bundle.js"></script>
    </body>
  </html>`
}
