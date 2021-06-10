require('dotenv').config()
var mongoose = require('mongoose')

mongoose.connect(process.env['MONGODB_URI'], { useNewUrlParser: true, useUnifiedTopology: true })

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true },
    logs: [{ type: Schema.Types.ObjectId, ref: 'Log' }]
})
const LogSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now }
})

const User = mongoose.model("User", UserSchema)
const Log = mongoose.model("Log", LogSchema)

const createAndSaveUser = (userName, done) => {
    var user = new User({username: userName})
    user.save((error, usr) => {
        if (error) return done(error)
        done(null, {username: usr.username, _id: usr._id})
    })
}

const getAllUsers = (done) => {
    User.find({}, (err, users) => {
        if (err) return done(err)
        done(null, users.map((user) => {
            return {
                username: user.username,
                _id: user._id
            }
        }))
    })
}

const createAndSaveLog = (userId, data, done) => {
    User.findById(userId, (err, user) => {
        if (err) return done(err)
        if (!user) return done({status: 400, message: 'Unknown userId'})
        
        const log = new Log({
            user: user._id,
            description: data.description,
            duration: data.duration,
            date: data.date ? new Date(data.date).getTime() : Date.now()
        })

        log.save((err, data) => {
            if (err) return done(err)
            done(null, {
                _id: user._id,
                username: user.username,
                description: log.description,
                duration: log.duration,
                date: new Date(log.date).toDateString()
            })
        })
    })
}

const getLogs = (userId, queryParams, done) => {

    let filter = {
        user: userId
    }

    if (queryParams.from && queryParams.to) {
        filter.date = { $gte: new Date(queryParams.from).getTime(), $lte: new Date(queryParams.to) }
    } else if (queryParams.from) {
        filter.date = { $gte: new Date(queryParams.from).getTime() }
    } else if (queryParams.to) {
        filter.date = { $lte: new Date(queryParams.to) }
    }

    User.findById(userId, (err, user) => {
        if (err) return done(err)

        if (user) {
            let query = Log.find(filter)

            if (queryParams.limit) {
                query = query.limit(parseInt(queryParams.limit))
            }
            
            query.exec((err, logs) => {
                    if (err) return done(err)
                    done(null, {
                        _id: user._id,
                        username: user.username,
                        count: logs.length,
                        log: logs.map((log) => {
                            return {
                                description: log.description,
                                duration: log.duration,
                                date: new Date(log.date).toDateString()
                            }
                        })
                    })
                })
        }
    })
}

exports.UserModel = User
exports.createAndSaveUser = createAndSaveUser
exports.getAllUsers = getAllUsers
exports.createAndSaveLog = createAndSaveLog
exports.getLogs = getLogs