## Dev Env
First need Node.js installed, also `npm` or `yarn` is required. Run `npm install` or `yarn` in the project folder. 

## Dev Server
Run `gulp` in the project folder and a dev server will start to serve resources. `http://localhost:3000` and `http://localhost:3000/video.html` are two entries.  

## Build
Open `build\webpack.production.conf.js` and modify line 13 `publicPath` to production CDN or resource serve prefix, and then `gulp build:production`.  
Assets in `dist` are production ready resources, just deploy to any web serve and all set.
