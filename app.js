const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const fetch = require('node-fetch');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String,
    chuck: ChuckNorris,
    git: Git
  },
  type ChuckNorris {
    icon_url: String,
    id: String,
    url: String,
    value: String
  },
  type Git {
    total_count: Int,
    items: [Repo]
    
  },
  type Repo {
    name: String,
    owner: RepoOwner,
    description: String,
    html_url: String,
    forks: Int,
    watchers: Int
    language: String
  },
  type RepoOwner {
    login: String,
    avatar_url: String,
    html_url: String
   }
`);

// The root provides a resolver function for each API endpoint
const root = {
    hello: () => {
        return 'Hello world!';
    },
    chuck:  () => {
        return fetch("https://api.chucknorris.io/jokes/random", {method: "GET"})
            .then(res => res.json())
            .catch(err => console.log(err))
    },
    git: () => {
        return fetch("https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=100", {method: "GET"})
            .then(res => res.json())
            .catch(err => console.log(err))
    }
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');