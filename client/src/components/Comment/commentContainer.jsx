import React from 'react';
import { connect } from 'react-redux';
import CommentItem from '.';

const CommentContainer = ({
    id,
    text,
    postId,
    userId,
    name,
    avatar,
    avatarType,
    verify,
    wallet,
    date,
    authUserId,
    thread,
    deleteCommentBackend,
    getReplyBackend,
    replyCount,
    addPageReplyBackend,
    deleteReplyBackend,
    replyUserId,
    replyCommentId,
    parentCommentId,
    addReplyBackend
    }) => {

    let replyElements = null;

    if (thread) {
        replyElements = thread.items.map(reply => 
            <CommentItem
                key={reply.id}
                id={reply.id}
                text={reply.text}
                postId={reply.postId}
                userId={reply.userId}
                name={reply.name}
                avatar={reply.avatar}
                avatarType={reply.avatarType}
                verify={reply.verify}
                wallet={reply.wallet}
                replyName={reply.replyName}
                replyWallet={reply.replyWallet}
                replyUserId={reply.replyUserId}
                replyCommentId={reply.replyCommentId}
                date={reply.date}
                authUserId={authUserId}
                deleteCommentBackend={deleteCommentBackend}
                deleteReplyBackend={deleteReplyBackend}
                commentId={reply.commentId}
                pages={thread.pages}
                parentCommentId={parentCommentId}
                addReplyBackend={addReplyBackend}
                parentPostId={postId}
            />
        );
    }

    
    
    return (
        <>
        <CommentItem
            key={id}
            id={id}
            text={text}
            postId={postId}
            userId={userId}
            name={name}
            avatar={avatar}
            avatarType={avatarType}
            verify={verify}
            wallet={wallet}
            date={date}
            authUserId={authUserId}
            thread={thread}
            replyUserId={replyUserId}
            replyCommentId={replyCommentId}
            deleteCommentBackend={deleteCommentBackend}
            getReplyBackend={getReplyBackend}
            replyCount={replyCount}
            replyElements={replyElements}
            addPageReplyBackend={addPageReplyBackend}
            parentCommentId={parentCommentId}
            addReplyBackend={addReplyBackend}
            parentPostId={postId}
        />
        </>
    );
};

const mapStateToProps = state => ({
    
});

export default connect(mapStateToProps, {
    
})(CommentContainer);