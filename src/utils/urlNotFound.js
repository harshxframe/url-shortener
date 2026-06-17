export const htmlErrorBody = (status) => {
  return `
  <html>
        <head>
          <title>${status} - Not Found</title>
        </head>
        <body style="font-family:sans-serif;text-align:center;padding-top:100px">
          <h1>${status}</h1>
          <h2>URL Not Found</h2>
          <p>The short URL does not exist or has expired.</p>
        </body>
      </html>
`;
};
