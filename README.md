# :door: DigLife Portal

## Purpose & Use

The DigLife Portal is a waystation for all members of the Digital Life Collective to discover and access shared services, work teams and operational areas organized into four domains - Home, Projects, Ops and Friends. The purpose of the portal is to make it easy for members (1) to discover all services and teams the Collective has to offer, (2) to request access to services and teams (via a Sudo Protocol) and (3) to decentralize the operation of the Collective as much as possible (via various protocols).

Each service/team has a corresponding support channel in Mattermost, which is the conversation/chat tool of the Collective. As soon as a new channel is created in Mattermost and configured to work with the portal, it will show up in the navigation panel on the left side. To open the panel, simply click on the Hamburger Menu icon on the top left. To switch to a different domain, click on one of the menu items on the top.

The best way to get started is to sign up with Mattermost (as a new member you should receive an email invitation) and log into the portal with your username. Then explore the services/teams for each of the four domains and request access to those that are of interest to you. Since each service/team has a corresponding channel on Mattermost, we will get back to you as soon as we have received your access request. If you have have any questions, please drop by the [HELP DESK](https://chat.diglife.coop/diglife/channels/help-desk) on Mattermost.

1. **Home** - Access to main services/teams available for all members. This also includes Interest Groups (i.e. non-workteam related groups)
2. **Projects** - These are workteams organized around value-producing (service-providing) projects with access to supporting services.
3. **Operations** - These are workteams organized around internal operations, such as Marketing, Finance, Legal, etc.
4. **Friends** - These are separate domains to bring other collectives to DigLife.

## Implementation

### Design Process

We attempt to follow a "Social Design Process" that is human-centered, generative and embedded in the needs of the Collective. The aim is to create a "creative tension" that propels our vision forward, rather than creating a "stressful tension" that focuses on the problems (see Robert Fritz, 1989)

![Robert Fritz](https://notepad.diglife.coop/uploads/upload_fff8af57d7f14ccd28168676f79a35f2.png)

Cheryl Heller describes the Social Design Process in her book _Intergalactic Design - Applying Social Design to Sustainability_ which we will attempt to follow closely here. The project is not an excercise in planning and executing the plan, but rather an open participatory process of [sensing and responding](https://en.wikipedia.org/wiki/Cynefin_framework) to the model we want to create for the Collective and others who follow along.

![Cheryl Heller](https://notepad.diglife.coop/uploads/upload_05ca6ae1148b5cb9a1db74083b606374.jpg)

### Dev Process

We are developing this portal with a [Vue JavaScript frontend](https://vuejs.org/) using the [CodeSandBox online IDE](https://codesandbox.io/).
CodeSandBox can be forked to allow multiple parties to co-develop the application. As a developer, make sure to commit your work to GitHub before changing machines and refresh the code on new machines.
There is also a live-coding feature to allow multiple parties edit the code concurrently in realtime.

## Resources

### Structure and guides

https://itnext.io/how-to-structure-a-vue-js-project-29e4ddc1aeeb (all in /src)
https://vuejs.org/v2/style-guide/

### CSS Framework

We are using the [Vue Material](https://vuematerial.io/) CSS framework to accelerate the development of key UI elements, such as [Navigation](https://vuematerial.io/components/drawer) and [Cards](https://vuematerial.io/components/card).

### Authentication

Stripe (payment) > Mailtrain (member list) > Mattermost Invite (account) > DigLife.coop (OAuth 2)
https://docs.mattermost.com/developer/oauth-2-0-applications.html (OAuth for DigLife.coop)
https://cloudron.io/blog/2017-03-21-oauth-provider.html (OAuth for Cloudron apps)
https://auth0.com/authenticate/vuejs/oauth2/ (OAuth for social apps)
https://auth0.com/docs/connections/social/github (OAuth for Auth0 and GitHub)
https://www.npmjs.com/package/client-oauth2
https://alligator.io/vuejs/vue-jwt-patterns/ (w/o Vuex)
https://blog.sqreen.io/authentication-best-practices-vue/ (w/ vuex)
http://jasonwatmore.com/post/2018/09/21/vuejs-basic-http-authentication-tutorial-example
https://blog.pusher.com/fullstack-graphql-app-prisma-apollo-vue/ (w/ Apollo)

### Vuex and APIs

https://vuex.vuejs.org/
https://www.thepolyglotdeveloper.com/2018/04/vuejs-app-using-axios-vuex/
https://zendev.com/2018/05/21/vuex-perfect-interface-frontend-backend.html
https://stackoverflow.com/questions/40813975/how-to-structure-api-calls-in-vue-js

### Vue CLI

http://vuejs-templates.github.io/webpack
http://vuejs.github.io/vue-loader

### Known issues

The main limitation of cookies on mobile browsers is that they reset when the browser is closed or when the phone is shut down/restarted.
