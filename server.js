const express = require('express')
const expressGraphQL = require('express-graphql')

const schema = require('./schema/schema')

const app = express()

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true,
}))

app.listen(4000, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on PORT 4000...')
})
