# Vue Patterns

## Vue Templates

Each Vue components is structured into three parts - the template, the script and the the style. For this project, we store styles in the `src/assets/styles` folder and components in the `src/components` folder (use <Name>.vue). See more on the [template syntax here](https://vuejs.org/v2/guide/syntax.html)

```html=
<template
  >...template here...</template
>
<script>
  ...script here...
</script>
<style>
  ...style here...
</style>
```

## Vue Script

The script section contains definitions for the import and export of components, local data structures as well as functions. See more with the [Vue LifeCyce Diagram](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)

```html=
<script>
  import Tags from "./Tags";
  export default {
    name: "Navbar",
    components: { Particles, Tags, Cards, Notes },
    data: () => ({
      showNavigation: false
    }),
    created: function() {},
    computed: {
      name: function() {},
      name: function() {}
    },
    methods: {
      name: function() {},
      name: function() {},
      name: function() {}
    }
  };
</script>
```

## v-for Directive

Use this directive to render lists of elements.

```html=
<md-list-item v-for="(member, index) in members" :key="member.id">
  {{ member.first_name }} {{ member.last_name }}
</md-list-item>
```

## v-if Directive

Use this directive for html elements that should be conditionally hidden or shown. This is reactive and will change when the dependent variable changes. This is also better than `display: none;` since no style change is required.

```html=
<p v-if="channel.purpose">{{ channel.purpose.tags }}</p>
```

## md-active Directive

Use this directive for Vue Materialize components that should be conditionally activated.

```html=
<md-snackbar :md-active.sync="showSnackBar"></md-snackbar>
```

## Arrow Functions

[Arrow functions](https://medium.freecodecamp.org/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26) are bound to the parent context and as such can make use of the data declarations via `this.variable`.

```html=
this.channels.forEach((channel, index, arr) => { if (channel.channel_id ===
this.channel.channel_id) { if (arr[index].menu === undefined) { arr[index].menu
= []; } // push new menu entry to channels arr[index].menu.push({ title:
this.menutitle, link: this.menulink, icon: this.menuicon }); // write entire
menu to Firebase db.database() .ref("portal_extensions/" +
this.channel.channel_id + "/menu") .set(arr[index].menu); this.snack = "Menu
entry successfully added."; this.showSnackBar = true; window.open(this.menulink,
"theApp"); } });
```

# API Patterns

## Axios

We are using Axios promises to access the API of an application. API calls are consuming lots of resources and we want to load them only once at the start of the application in `index.js`

```html=
this.axios .get(BASEURL + "webhooks/portal_users.php") .then(response =>
(this.users = response.data)) .then(response => db .database()
.ref("portal_users") .update(this.users) );
```

# Firebase Patterns

## Firebase Events

We are using the `child_added` and `child_changed` events to update any user interface element in real-time across all connected clients. It returns a snapshot for the data that can be looped over.

```html=
let usersRef = db.database().ref("portal_users"); usersRef.on("child_added",
user => { //snapshot.forEach(user => { this.users.push(user.val()); if
(user.val().username === this.$cookies.get("username")) { this.profile =
user.val(); this.username = this.$cookies.get("username"); this.activeUser =
false; console.log("This user: ", user.val()); } //}); });
```
