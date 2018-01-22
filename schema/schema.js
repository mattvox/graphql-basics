/* eslint no-unused-vars: [2, { "args": "none" }] */
/* eslint no-use-before-define: [2, { "variables": false }] */

const axios = require('axios')
const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql

const ROOT_URL = 'http://localhost:3000'

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`${ROOT_URL}/companies/${parentValue.id}/users`)
          .then(response => response.data)
      },
    },
  }),
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`${ROOT_URL}/companies/${parentValue.companyId}`)
          .then(response => response.data)
      },
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`${ROOT_URL}/users`)
          .then(response => response.data)
      },
    },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve(parentValue, args) {
        return axios.get(`${ROOT_URL}/companies`)
          .then(response => response.data)
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`${ROOT_URL}/users/${args.id}`)
          .then(response => response.data)
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`${ROOT_URL}/companies/${args.id}`)
          .then(response => response.data)
      },
    },
  },
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, age, companyId }) {
        return axios.post(`${ROOT_URL}/users`, {
          firstName,
          age,
          companyId,
        })
          .then(response => response.data)
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      // eslint-disable-next-line object-curly-newline
      resolve(parentValue, args) {
        return axios.patch(`${ROOT_URL}/users/${args.id}`, args)
          .then(response => response.data)
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return axios.delete(`${ROOT_URL}/users/${id}`)
          .then(response => response.data)
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
})
