const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const fetch = require('node-fetch');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String,
    chuck: ChuckNorris,
    git(page: Int): Git,
    movie(query: String!): MovieSearch
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
   },
   type MovieSearch {
    Response: Boolean,
    Search: [Movie],
    totalResults: String
   },
   type Movie {
    Poster: String,
    Title: String,
    Year: String,
    imdbID: String
   }
`);


// The root provides a resolver function for each API endpoint
const root = {
    hello: () => {
        return 'Hello world!';
    },
    chuck:  () => {
        console.log(' Calling Chuck Norris API');
        return fetch("https://api.chucknorris.io/jokes/random", {method: "GET"})
            .then(res => res.json())
            .catch(err => console.log(err))
    },
    git: (args) => {
        console.log(' Calling Git API');
        return fetch(`https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=20&page=${args.page ? args.page : '1'}`, {method: "GET"})
            .then(res => res.json())
            .catch(err => console.log(err))
    },
    movie: (args) => {
        console.log(' Calling OMDB API');
        return fetch(`http://www.omdbapi.com/?apikey=79bd8f50&s=${args.query}`, {method: "GET"})
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