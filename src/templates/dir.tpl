<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui'>
    <meta name='screen-orientation' content='portrait'/>
    <meta name='apple-mobile-web-app-capable' content='yes'>
    <meta name='format-detection' content='telephone=no'>
    <meta name='full-screen' content='yes'>
    <meta name='x5-fullscreen' content='true'>
    <title>{{title}}</title>
    <style>
      body {
        margin: 30px;
      }
      a {
        display: block;
        font-size: 20px;
      }
    </style>
  </head>
  <body>
    {{#each files}}
      <a href="{{../dir}}/{{file}}">【{{icon}}】{{file}}</a>
    {{/each}}
  </body>
</html>