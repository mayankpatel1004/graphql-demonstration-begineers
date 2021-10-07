const express = require("express");
const {buildSchema} = require("graphql");
const {graphqlHTTP} = require("express-graphql");
const axios = require("axios");

const app = express();

/*
ID
String
Int
Float
Boolean
List - []
*/

let message = "This is initial message !!!";

const schema = buildSchema(`

    type Post {
        userId: Int,
        id: Int,
        title: String,
        body: String
    }

    type User {
        name: String
        age: Int
        college: String
    }

    type Query {
        hello: String!,
        welcomeMessage (name: String, dayOfWeek: String!): String
        getUser: User
        getUsers: [User]
        getPostsFromExternalAPI: [Post]
        message: String
    }

    input UserInput {
        name: String!
        age: Int!
        college: String!
    }

    type Mutation {
        setMessage(newMessage: String): String
        createUser(user: UserInput): User
    }
`);

//createUser(name: String!, age: Int!, college: String!) : User

const root = {
    hello: () => {
        return "Hello World !";
        //return null;
    },
    welcomeMessage : (args) => {
        console.log(args);
        return `Hey, ${args.name} Hows Life, today is ${args.dayOfWeek}`;
    },
    getUser: () => {
        const user = {
            name: "Mike Patel",
            age: 26,
            college: "VVP Engg.."
        }
        return user;
    },
    getUsers: () => {
        const users = [
            {
                name: "First Name",
                age: 26,
                college: "AITS"
            },
            {
                name: "Second Name",
                age: 36,
                college: "VVP"
            }
        ]
        return users;
    },
    getPostsFromExternalAPI: async () => {
       //return axios.get('https://jsonplaceholder.typicode.com/posts').then(result => result.data);
       const result = await axios.get('https://jsonplaceholder.typicode.com/posts');
       return result.data;
    },
    setMessage: ({newMessage}) => {
        message = newMessage;
        return message;
    },
    // message : () => {
    //     return message;
    // },
    message: () => message, // above message and this are same.
    createUser: (args) => {
        return args.user;
    }
}

// http://localhost:4000/graphql
app.use("/graphql",
graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root
}));


app.listen(4000,() => console.log(`Server is on port 4000`));