/**
 * Created by zeng on 17-1-12.
 */

var User = require('../lib/monogo').User;

module.exports = {
    //注册一个用户
    create (user) {
        return User.create(user).exec();
    },

    //通过用户名获取用户信息
    getUserByName (name) {
        return User
            .findOne({name: name})
            .addCreatedAt()
            .exec()
    }
}