import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Pencil,
  Trash2,
  X,
  Check,
  Heart,
  Share2,
} from "lucide-react";
import api from "../services/api";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState(location.state?.post || null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(!location.state?.post);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [liking, setLiking] = useState(false);
  const [sharing, setSharing] = useState(false);

  const defaultImage =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  useEffect(() => {
    getPostDetails();
  }, [id]);

  const getPostDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {}
      }

      const profileResponse = await api.get("/users/profile-data", {
        headers,
      });

      const profileData = profileResponse.data?.data;

      const profileUser =
        profileData?.user ||
        profileData?.data?.user ||
        profileData;

      if (profileUser) {
        setCurrentUser(profileUser);
        localStorage.setItem("user", JSON.stringify(profileUser));
      }

      if (!location.state?.post) {
        const postsResponse = await api.get(
          "/posts?page=1&limit=100",
          {
            headers,
          }
        );

        const data = postsResponse.data?.data;

        let allPosts = [];

        if (Array.isArray(data)) {
          allPosts = data;
        } else if (Array.isArray(data?.posts)) {
          allPosts = data.posts;
        } else if (Array.isArray(data?.data)) {
          allPosts = data.data;
        }

        const foundPost = allPosts.find(
          (item) =>
            String(item?._id || item?.id || item?.postId) ===
            String(id)
        );

        if (foundPost) {
          setPost(foundPost);
        }
      }

      const commentsResponse = await api.get(
        `/posts/${id}/comments?page=1&limit=50`,
        {
          headers,
        }
      );

      const commentsData = commentsResponse.data?.data;

      if (Array.isArray(commentsData)) {
        setComments(commentsData);
      } else if (Array.isArray(commentsData?.comments)) {
        setComments(commentsData.comments);
      } else if (Array.isArray(commentsData?.data)) {
        setComments(commentsData.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const createComment = async () => {
    if (!commentText.trim() || sending) return;

    try {
      setSending(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        `/posts/${id}/comments`,
        {
          content: commentText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newComment = response.data?.data;

      if (newComment) {
        setComments((prevComments) => [
          ...prevComments,
          newComment,
        ]);
      } else {
        await getPostDetails();
      }

      setCommentText("");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    } finally {
      setSending(false);
    }
  };

  const getCommentId = (comment) =>
    comment?._id ||
    comment?.id ||
    comment?.commentId;

  const getCommentUserId = (comment) =>
    comment?.commentCreator?._id ||
    comment?.commentCreator?.id ||
    comment?.commentCreator?.userId ||
    comment?.user?._id ||
    comment?.user?.id ||
    comment?.user?.userId ||
    comment?.author?._id ||
    comment?.author?.id ||
    comment?.userId ||
    comment?.authorId ||
    null;

  const getCurrentUserId = () =>
    currentUser?._id ||
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.user?._id ||
    currentUser?.user?.id ||
    currentUser?.user?.userId ||
    null;

  const isMyComment = (comment) => {
    const commentUserId = getCommentUserId(comment);
    const currentUserId = getCurrentUserId();

    if (!commentUserId || !currentUserId) {
      return false;
    }

    return String(commentUserId) === String(currentUserId);
  };

  const startEdit = (comment) => {
    setEditingCommentId(getCommentId(comment));
    setEditingText(
      comment?.content ||
        comment?.body ||
        comment?.text ||
        ""
    );
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const updateComment = async (commentId) => {
    if (!editingText.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/posts/${id}/comments/${commentId}`,
        {
          content: editingText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedComment = response.data?.data;

      setComments((prevComments) =>
        prevComments.map((comment) =>
          getCommentId(comment) === commentId
            ? {
                ...comment,
                ...(updatedComment || {}),
                content:
                  updatedComment?.content ||
                  editingText.trim(),
              }
            : comment
        )
      );

      cancelEdit();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to update comment"
      );
    }
  };

  const deleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(
        `/posts/${id}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((prevComments) =>
        prevComments.filter(
          (comment) =>
            getCommentId(comment) !== commentId
        )
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete comment"
      );
    }
  };

  const getLikesCount = () => {
    if (Array.isArray(post?.likes)) {
      return post.likes.length;
    }

    return (
      post?.likeCount ||
      post?.likesCount ||
      0
    );
  };

  const getCurrentLikeStatus = () => {
    const currentUserId = getCurrentUserId();

    if (Array.isArray(post?.likes) && currentUserId) {
      return post.likes.some((like) => {
        const likeId =
          like?._id ||
          like?.id ||
          like?.user?._id ||
          like?.user?.id ||
          like?.userId;

        return String(likeId) === String(currentUserId);
      });
    }

    return Boolean(
      post?.liked ||
      post?.isLiked ||
      post?.userLiked
    );
  };

  const likePost = async () => {
    if (liking || !post) return;

    try {
      setLiking(true);

      const token = localStorage.getItem("token");

      const response = await api.put(
        `/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data?.data;

      if (responseData) {
        setPost((prevPost) => ({
          ...prevPost,
          ...responseData,
        }));
      } else {
        const currentLiked = getCurrentLikeStatus();
        const currentCount = getLikesCount();

        setPost((prevPost) => ({
          ...prevPost,
          liked: !currentLiked,
          likeCount: currentLiked
            ? Math.max(0, currentCount - 1)
            : currentCount + 1,
        }));
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to like post"
      );
    } finally {
      setLiking(false);
    }
  };

  const sharePost = async () => {
    if (sharing || !post) return;

    try {
      setSharing(true);

      const token = localStorage.getItem("token");

      await api.post(
        `/posts/${id}/share`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const postUrl =
        `${window.location.origin}/post/${id}`;

      if (navigator.share) {
        await navigator.share({
          title: "Route Posts",
          text: "Check out this post",
          url: postUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);
        alert("Post link copied successfully");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error);

        alert(
          error.response?.data?.message ||
            "Failed to share post"
        );
      }
    } finally {
      setSharing(false);
    }
  };

  const getPostName = () =>
    post?.user?.name ||
    post?.user?.username ||
    post?.author?.name ||
    post?.author?.username ||
    post?.createdBy?.name ||
    post?.createdBy?.username ||
    "User";

  const getPostImage = () =>
    post?.user?.photo ||
    post?.user?.profilePhoto ||
    post?.user?.image ||
    post?.author?.photo ||
    post?.author?.profilePhoto ||
    post?.author?.image ||
    defaultImage;

  const getCommentName = (comment) =>
    comment?.commentCreator?.name ||
    comment?.commentCreator?.username ||
    comment?.user?.name ||
    comment?.user?.username ||
    comment?.author?.name ||
    comment?.author?.username ||
    "User";

  const getCommentImage = (comment) =>
    comment?.commentCreator?.photo ||
    comment?.commentCreator?.profilePhoto ||
    comment?.commentCreator?.image ||
    comment?.user?.photo ||
    comment?.user?.profilePhoto ||
    comment?.user?.image ||
    comment?.author?.photo ||
    comment?.author?.profilePhoto ||
    comment?.author?.image ||
    defaultImage;

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#f0f2f5]"
        style={{ fontFamily: "Cairo, sans-serif" }}
      >
        <p className="text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-[#f0f2f5]"
        style={{ fontFamily: "Cairo, sans-serif" }}
      >
        <h2 className="mb-4 text-xl font-bold text-gray-700">
          Post not found
        </h2>

        <button
          onClick={() => navigate("/home")}
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const liked = getCurrentLikeStatus();
  const likesCount = getLikesCount();

  return (
    <div
      className="min-h-screen bg-[#f0f2f5]"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <h1 className="ml-4 text-lg font-bold text-gray-800">
            Post Details
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <article className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <img
              src={getPostImage()}
              alt="User"
              className="h-11 w-11 rounded-full object-cover"
            />

            <div>
              <h3 className="font-semibold text-gray-800">
                {getPostName()}
              </h3>

              <p className="text-xs text-gray-500">
                {post?.createdAt
                  ? new Date(
                      post.createdAt
                    ).toLocaleString()
                  : "Recently"}
              </p>
            </div>
          </div>

          <p className="mb-5 whitespace-pre-wrap text-gray-700">
            {post?.body ||
              post?.content ||
              post?.text ||
              ""}
          </p>

          {post?.image && (
            <img
              src={post.image}
              alt="Post"
              className="mb-5 max-h-[600px] w-full rounded-xl object-cover"
            />
          )}

          <div className="flex items-center justify-between border-t pt-3 text-sm text-gray-500">
            <button
              onClick={likePost}
              disabled={liking}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition ${
                liked
                  ? "text-red-500"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Heart
                size={19}
                fill={
                  liked
                    ? "currentColor"
                    : "none"
                }
              />
              Like
              {likesCount > 0 && (
                <span>{likesCount}</span>
              )}
            </button>

            <button
              onClick={sharePost}
              disabled={sharing}
              className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100"
            >
              <Share2 size={19} />
              Share
            </button>
          </div>
        </article>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-extrabold text-slate-900">
            Comments
          </h2>

          <div className="mb-5 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createComment();
                }
              }}
              placeholder="Write a comment..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#1877f2] focus:bg-white"
            />

            <button
              onClick={createComment}
              disabled={
                !commentText.trim() ||
                sending
              }
              className="flex items-center justify-center rounded-xl bg-[#1877f2] px-4 text-white transition hover:bg-[#166fe5] disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="py-5 text-center text-sm text-slate-500">
                No comments yet.
              </p>
            ) : (
              comments.map((comment) => {
                const commentId =
                  getCommentId(comment);

                return (
                  <div
                    key={commentId}
                    className="flex gap-3"
                  >
                    <img
                      src={getCommentImage(comment)}
                      alt="User"
                      className="h-9 w-9 rounded-full object-cover"
                    />

                    <div className="flex-1 rounded-2xl bg-slate-100 px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-extrabold text-slate-900">
                          {getCommentName(comment)}
                        </p>

                        {isMyComment(comment) && (
                          <div className="flex items-center gap-1">
                            {editingCommentId ===
                            commentId ? (
                              <>
                                <button
                                  onClick={() =>
                                    updateComment(
                                      commentId
                                    )
                                  }
                                  className="rounded-lg p-2 text-green-600 hover:bg-green-100"
                                >
                                  <Check size={16} />
                                </button>

                                <button
                                  onClick={cancelEdit}
                                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-200"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    startEdit(comment)
                                  }
                                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-100"
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  onClick={() =>
                                    deleteComment(
                                      commentId
                                    )
                                  }
                                  className="rounded-lg p-2 text-red-600 hover:bg-red-100"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {editingCommentId ===
                      commentId ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) =>
                            setEditingText(
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter"
                            ) {
                              updateComment(
                                commentId
                              );
                            }

                            if (
                              e.key === "Escape"
                            ) {
                              cancelEdit();
                            }
                          }}
                          autoFocus
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#1877f2]"
                        />
                      ) : (
                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {comment.content ||
                            comment.body ||
                            comment.text ||
                            ""}
                        </p>
                      )}

                      <p className="mt-2 text-[11px] text-slate-500">
                        {comment.createdAt
                          ? new Date(
                              comment.createdAt
                            ).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PostDetails;