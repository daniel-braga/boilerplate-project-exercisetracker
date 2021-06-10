require('dotenv').config()
var mongoose = require('mongoose')

mongoose.connect(process.env['MONGODB_URI'], { useNewUrlParser: true, useUnifiedTopology: true })

const Schema = mongoose.Schema;
const UserTrackSchema = new Schema({
    username: { type: String, required: true },
    logs: [{
        description: { type: String, required: true },
        duration: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    }]
})

const UserTrack = mongoose.model("UserTrack", UserTrackSchema)

const createAndSaveUser = (userName, done) => {
    var user = new UserTrack({username: userName})
    user.save((error, usr) => {
        if (error) return done(error)
        done(null, {username: usr.username, _id: usr._id})
    })
}

const getAllUsers = (done) => {
    UserTrack.find({}, (err, users) => {
        if (err) return done(err)
        done(null, users.map((user) => {
            return {
                username: user.username,
                _id: user._id
            }
        }))
    })
}

exports.UserTrackModel = UserTrack
exports.createAndSaveUser = createAndSaveUser
exports.getAllUsers = getAllUsers