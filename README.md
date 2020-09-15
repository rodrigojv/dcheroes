<h1 align="center">Welcome to dcheroes 👋</h1>
<div align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>

[![Twitter Follow](https://img.shields.io/twitter/follow/rodrigoj_el?style=social)](https://twitter.com/rodrigoj_el)

</div>

A public GraphQL API for DC Heroes and Characters.

Inspired by [SWAPI](https://github.com/graphql/swapi-graphql), the Star Wars GraphQL API. Aimed to be used as a tool to learn/teach GraphQL, or just to play around 🥰.

Uses a json file as a datasource, which was manually consolidated from info found in the [official DC web site](https://www.dccomics.com/characters)

## Docs

Try out the queries and explore the schema on [the playground](https://dcheroes.herokuapp.com/).

You can query a single `character` by name.

```graphql
{
  character(name: "Superman") {
    name
    alterEgo
    occupation
    powers
  }
}
```

With the following json as a result:

```json

  "data": {
    "character": {
      "name": "Superman",
      "alterEgo": "Clark Kent, Kal-El",
      "occupation": "Reporter",
      "powers": "super strength, flight, invulnerability, super speed, heat vision, freeze breath, x-ray vision, superhuman hearing, healing factor"
    }
  }
}
```

Or you can also query a collection of `characters`, `villains`, `heroes` and `teams`. Each of those queries with an optional filter parameter that includes a `keyword` field.

Example:

```graphql
{
  characters(filter: { keyword: "reporter" }) {
    name
  }
}
```

Will produce as a result the following json:

```json
{
  "data": {
    "characters": [
      {
        "name": "Jimmy Olsen"
      },
      {
        "name": "Lois Lane"
      },
      {
        "name": "Superman"
      }
    ]
  }
}
```

## Todo

- [ ] Movie/TV appearances for each character
- [ ] Actors who played, voiced the characters
- [ ] Custom domain name

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
