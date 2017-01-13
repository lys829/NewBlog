/**
 * Created by zeng on 17-1-12.
 */

var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

var postModel = require('../models/posts');

// 所有用户或指定用户的文章页
router.get('/', function (req, res, next) {
    var author = req.query.author;
    postModel.getPosts(author)
        .then((posts) => {
            res.render('posts', {posts: posts})
        })
        .catch(next)
});


// 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
    res.render('create');
});

//发表一篇文章
router.post('/', checkLogin, function (req, res, next) {
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题');
        }
        if (!content.length) {
            throw new Error('请填写内容');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }
    let post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };

    postModel.create(post)
        .then( (result) => {
            post = result.ops[0];
            req.flash('success', '发表成功');
            res.redirect(`/posts/${post._id}`);
        })
        .catch(next);
});

//单独一篇文章的页面
router.get('/:postId', function (req, res, next) {
    let postId = req.params.postId;

    if(!/\d+/.test(postId)){
        return;
    }

    Promise.all([postModel.getPostById(postId), postModel.incPv(postId)])
        .then((result) => {
            let post = result[0];
            if(!post) {
                throw new Error('该文章不存在');
            }
            res.render('post', {post: post});
        })
        .catch(next);
});

//更新文章的页面
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    let postId = req.params.postId;
    let author = req.session.user._id;

    postModel.getRawPostById(postId)
        .then( (post) => {
            if(!post) {
                throw new Error('该文章不存在')
            }

            if(author.toString() != post.author._id.toString() ) {
                throw new Error('权限不足');
            }

            res.render('edit', {post: post});
        })
        .catch(next);
});

//更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
    let postId = req.params.postId;
    let author = req.session.user._id;
    let title = req.fields.title;
    let content = req.fields.content;

    postModel.updatePostById(postId, author, {title: title, content: content})
        .then( ()=>{
            req.flash('success', '编辑文章成功');
            res.redirect(`/posts/${postId}`)
        })
        .catch(next)
});

//删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    let postId = req.params.postId;
    let author = req.session.user._id;

    postModel.delPostById(postId, author)
        .then( ()=> {
            req.flash('success', '删除文章成功');
            req.redirect('/posts');
        })
        .catch(next)
});

//创建一条留言
router.post('/:postId/comment', checkLogin, function (req, res, next) {
     res.send(req.flash());
});

//删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;