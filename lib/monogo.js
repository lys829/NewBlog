/**
 * Created by zeng on 17-1-12.
 */

var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();

mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

//根据id生成创建时间
//24 位长的 ObjectId 前 4 个字节是精确到秒的时间戳，所以并没有额外的存创建时间（如: createdAt）的字段
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach( (item) => {
            item.create_at = moment(objectIdToTimestamp((item._id))).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if(result) {
            result.create_at = moment(objectIdToTimestamp((result._id))).format('YYYY-MM-DD HH:mm');
        }

        return result;
    }
});


/**
 * 用户模型
 *
 * p.s. enum 验证器
 */
let User = mongolass.model('User', {
    name: {type: 'string'},
    password: {type: 'string'},
    avatar: {type: 'string'},
    gender: {type: 'string', enum: ['m', 'f', 'x']},
    bio: {type: 'string'}
});

// 根据用户名找到用户，用户名全局唯一
User.index({name: 1}, {unique: true}).exec();

/**
 * 文章模型
 *
 */
let Post = mongolass.model('Post', {
    author: {type: Mongolass.Types.ObjectId},
    title: {type: 'string'},
    content: {type: 'string'},
    pv: {type: 'number'}
});

// 按创建时间降序查看用户的文章列表
Post.index({author: 1, _id: -1}).exec();

module.exports = {
    User,
    Post
};

