# DigLife Portal
## Purpose
This is the implementation of the DigLife portal, a single place from where authorized members can access all DigLife Services. THe portal is structured into four domains:

### DigLife Home
Access to main services available for all members. This also include Communities of Interest (i.e. non-workteam related groups) 
### DigLife Projects
These are workteams organized around value-added projects with access to supporting services.
### DigLife Operations
These are workteams organized around internal operations, such as Marketing, Finance, Legal, etc.
### DigLife Friends
These are external spaces to invite non-members such as guests, partners, sponsors, etc.

## Implementation
We are developing this portal with a [Vue JavaScript frontend](https://vuejs.org/) using the [CodeSandBox online IDE](https://codesandbox.io/). 

### Structure and guides
https://itnext.io/how-to-structure-a-vue-js-project-29e4ddc1aeeb (all in /src)
https://vuejs.org/v2/style-guide/

### CSS Framework
We are using the [Vue Material](https://vuematerial.io/) CSS framework to accelerat the development of key UI elements, such as Navigation and Cards. 

### Authorization
We authorize members through Cloudron API services (or Auth0). 

##### Vuex and APIs
https://vuex.vuejs.org/
https://www.thepolyglotdeveloper.com/2018/04/vuejs-app-using-axios-vuex/
https://zendev.com/2018/05/21/vuex-perfect-interface-frontend-backend.html
https://stackoverflow.com/questions/40813975/how-to-structure-api-calls-in-vue-js 

### Vue CLI
http://vuejs-templates.github.io/webpack
http://vuejs.github.io/vue-loader

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](.
