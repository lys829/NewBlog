/**
 * Created by zeng on 17-1-12.
 */

var marked = require('marked');
var Post = require('../lib/monogo').Post;

Post.plugin('contentToHtml', {
    afterFind (posts) {
        return posts.map( (post) => {
            post.content = marked(post.content);
            return post;
        })
    },
    afterFindOne: function (post) {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
});

module.exports = {
    //创建一篇文章
    create: (post) => {
        return Post.create(post).exec();
    },

    //通过文章id获取一篇文章
    getPostById (postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    //通过id获取一篇原生文章(编辑文章)
    getRawPostById (postId) {
        return Post
            .findOne({_id: postId})
            .populate({path: 'author', model: 'User'})
            .exec();
    },

    //通过用户id和文章id更新一篇文章
    updatePostById (postId, author, data) {
        return Post.update({author: author, _id: postId}, {$set: data}).exec();
    },

    //通过用户id和文章id删除一篇文章
    delPostById (postId, author){
        return Post.remove({author: author, _id: postId}).exec();
    },

    getPosts (author) {
        let query = {};
        if (author) {
            query.author = author;
        }
        return Post
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    incPv (postId) {
        return Post.update({_id: postId}, {$inc: {pv: 1}}).exec();
    }
}
