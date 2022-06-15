import { connect } from 'getstream'

const streamClient = connect(process.env.GET_STREAM_API_KEY, process.env.GET_STREAM_API_SECRET)

export default streamClient