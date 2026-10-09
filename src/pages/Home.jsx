import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  House,
  User,
  MessageCircle,
  Newspaper,
  Sparkles,
  Earth,
  Bookmark,
  Users,
  Image,
  Smile,
  Send,
  Search,
  Menu,
  Pencil,
  Trash2,
  Check,
  X,
  Heart,
  Share2,
} from "lucide-react";
import api from "../services/api";

function Home() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postText, setPostText] = useState("");
  const [user, setUser] = useState(null);
  const [creatingPost, setCreatingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostText, setEditingPostText] = useState("");
  const [updatingPost, setUpdatingPost] = useState(false);
  const [likingPostId, setLikingPostId] = useState(null);
  const [sharingPostId, setSharingPostId] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const defaultImage =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  useEffect(() => {
    getHomeData();
  }, []);

  const getHomeData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const profileResponse = await api.get("/users/profile-data", {
        headers,
      });

      const profileData = profileResponse.data?.data;

      const profileUser =
        profileData?.user ||
        profileData?.data?.user ||
        profileData;

      if (profileUser) {
        setUser(profileUser);
        localStorage.setItem("user", JSON.stringify(profileUser));
      }

      const postsResponse = await api.get("/posts/feed?page=1&limit=20", {
        headers,
      });

      const data = postsResponse.data?.data;

      if (Array.isArray(data)) {
        setPosts(data);
      } else if (Array.isArray(data?.posts)) {
        setPosts(data.posts);
      } else if (Array.isArray(data?.data)) {
        setPosts(data.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }

      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!postText.trim()) return;

    try {
      setCreatingPost(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/posts",
        {
          body: postText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newPost = response.data?.data;

      if (newPost) {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      } else {
        await getHomeData();
      }

      setPostText("");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to create post"
      );
    } finally {
      setCreatingPost(false);
    }
  };

  const getUserName = () =>
    user?.name ||
    user?.username ||
    user?.user?.name ||
    user?.user?.username ||
    "Hasnaa sarwat";

  const getUserImage = () =>
    user?.photo ||
    user?.profilePhoto ||
    user?.image ||
    user?.user?.photo ||
    user?.user?.profilePhoto ||
    defaultImage;

  const getPostUserName = (post) =>
    post?.user?.name ||
    post?.user?.username ||
    post?.author?.name ||
    post?.author?.username ||
    post?.createdBy?.name ||
    post?.createdBy?.username ||
    "User";

  const getPostUserImage = (post) =>
    post?.user?.photo ||
    post?.user?.profilePhoto ||
    post?.user?.image ||
    post?.author?.photo ||
    post?.author?.profilePhoto ||
    post?.author?.image ||
    defaultImage;

  const getPostBody = (post) =>
    post?.body ||
    post?.content ||
    post?.text ||
    "";

  const getPostImage = (post) =>
    post?.image ||
    post?.imageUrl ||
    post?.photo ||
    null;

  const getPostId = (post) =>
    post?._id ||
    post?.id ||
    post?.postId;

  const getPostUserId = (post) =>
    post?.user?._id ||
    post?.user?.id ||
    post?.user?.userId ||
    post?.author?._id ||
    post?.author?.id ||
    post?.author?.userId ||
    post?.createdBy?._id ||
    post?.createdBy?.id ||
    post?.createdBy?.userId ||
    post?.userId ||
    post?.authorId ||
    post?.createdById ||
    null;

  const getCurrentUserId = () =>
    user?._id ||
    user?.id ||
    user?.userId ||
    user?.user?._id ||
    user?.user?.id ||
    user?.user?.userId ||
    null;

  const isMyPost = (post) => {
    const postUserId = getPostUserId(post);
    const currentUserId = getCurrentUserId();

    if (
      postUserId !== null &&
      postUserId !== undefined &&
      currentUserId !== null &&
      currentUserId !== undefined
    ) {
      return String(postUserId) === String(currentUserId);
    }

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        const savedUserId =
          parsedUser?._id ||
          parsedUser?.id ||
          parsedUser?.userId ||
          parsedUser?.user?._id ||
          parsedUser?.user?.id;

        if (
          savedUserId &&
          postUserId &&
          String(savedUserId) === String(postUserId)
        ) {
          return true;
        }
      } catch {}
    }

    return false;
  };

  const getLikesCount = (post) => {
    if (Array.isArray(post?.likes)) {
      return post.likes.length;
    }

    return (
      post?.likeCount ||
      post?.likesCount ||
      0
    );
  };

  const isPostLiked = (post) => {
    const currentUserId = getCurrentUserId();

    if (Array.isArray(post?.likes) && currentUserId) {
      return post.likes.some((like) => {
        const likeId =
          like?._id ||
          like?.id ||
          like?.user?._id ||
          like?.user?.id;

        return String(likeId) === String(currentUserId);
      });
    }

    return Boolean(
      post?.liked ||
      post?.isLiked ||
      post?.userLiked
    );
  };

  const getSharesCount = (post) => {
    if (Array.isArray(post?.shares)) {
      return post.shares.length;
    }

    return (
      post?.shareCount ||
      post?.sharesCount ||
      0
    );
  };

  const startEditPost = (post) => {
    setEditingPostId(getPostId(post));
    setEditingPostText(getPostBody(post));
  };

  const cancelEditPost = () => {
    setEditingPostId(null);
    setEditingPostText("");
  };

  const updatePost = async (postId) => {
    if (!editingPostText.trim() || updatingPost) return;

    try {
      setUpdatingPost(true);

      const token = localStorage.getItem("token");

      const response = await api.put(
        `/posts/${postId}`,
        {
          body: editingPostText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedPost = response.data?.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          getPostId(post) === postId
            ? {
                ...post,
                ...(updatedPost || {}),
                body:
                  updatedPost?.body ||
                  editingPostText.trim(),
              }
            : post
        )
      );

      cancelEditPost();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to update post"
      );
    } finally {
      setUpdatingPost(false);
    }
  };

  const deletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts((prevPosts) =>
        prevPosts.filter(
          (post) => getPostId(post) !== postId
        )
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete post"
      );
    }
  };

  const likePost = async (postId) => {
    if (likingPostId) return;

    try {
      setLikingPostId(postId);

      const token = localStorage.getItem("token");

      const response = await api.put(
        `/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responsePost = response.data?.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (getPostId(post) !== postId) {
            return post;
          }

          if (responsePost) {
            return {
              ...post,
              ...responsePost,
            };
          }

          const liked = isPostLiked(post);
          const currentLikes = getLikesCount(post);

          return {
            ...post,
            liked: !liked,
            likeCount: liked
              ? Math.max(0, currentLikes - 1)
              : currentLikes + 1,
          };
        })
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to like post"
      );
    } finally {
      setLikingPostId(null);
    }
  };

  const sharePost = async (postId) => {
    if (sharingPostId) return;

    try {
      setSharingPostId(postId);

      const token = localStorage.getItem("token");

      await api.post(
        `/posts/${postId}/share`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const postUrl =
        `${window.location.origin}/post/${postId}`;

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

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          getPostId(post) === postId
            ? {
                ...post,
                shareCount:
                  getSharesCount(post) + 1,
              }
            : post
        )
      );
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log(error);

        alert(
          error.response?.data?.message ||
            "Failed to share post"
        );
      }
    } finally {
      setSharingPostId(null);
    }
  };

  const openPostDetails = (post) => {
    const postId = getPostId(post);

    if (postId) {
      navigate(`/post/${postId}`, {
        state: {
          post: post,
        },
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f0f2f5]"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img
              src="/route.png"
              alt="Route"
              className="h-9 w-9 rounded-lg object-cover"
            />

            <span className="text-xl font-bold text-gray-800">
              Route Posts
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 border-b-2 border-blue-600 px-3 py-5 font-semibold text-blue-600"
            >
              <House size={19} />
              Feed
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-5 text-gray-600 hover:text-blue-600"
            >
              <User size={19} />
              Profile
            </button>

            <button className="flex items-center gap-2 px-3 py-5 text-gray-600 hover:text-blue-600">
              <MessageCircle size={19} />
              Notifications
            </button>
          </nav>

          <div className="relative flex items-center gap-3">
            <button
              onClick={() =>
                setShowProfileMenu(!showProfileMenu)
              }
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100"
            >
              <img
                alt={getUserName()}
                className="h-8 w-8 rounded-full object-cover"
                src={getUserImage()}
              />

              <span className="hidden max-w-[140px] truncate text-sm font-semibold text-slate-800 md:block">
                {getUserName()}
              </span>

              <Menu
                size={15}
                className="text-slate-500"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-14 z-50 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <User size={18} />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/change-password");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Pencil size={18} />
                  Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-xl bg-white p-3 shadow-sm">
              <button
                onClick={() => navigate("/home")}
                className="mb-1 flex w-full items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 font-semibold text-blue-600"
              >
                <Newspaper size={20} />
                Feed
              </button>

              <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
                <Sparkles size={20} />
                My Posts
              </button>

              <button className="mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
                <Earth size={20} />
                Community
              </button>

              <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
                <Bookmark size={20} />
                Saved
              </button>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={getUserImage()}
                  alt="Profile"
                  className="h-11 w-11 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {getUserName()}
                  </h3>

                  <button className="text-sm text-gray-500 hover:text-blue-600">
                    Public
                  </button>
                </div>
              </div>

              <textarea
                value={postText}
                onChange={(e) =>
                  setPostText(e.target.value)
                }
                placeholder={`What's on your mind, ${getUserName()}?`}
                className="mb-4 min-h-[110px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 outline-none focus:border-blue-500 focus:bg-white"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100">
                    <Image
                      size={20}
                      className="text-green-500"
                    />
                    Photo/video
                  </button>

                  <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100">
                    <Smile
                      size={20}
                      className="text-yellow-500"
                    />
                    Feeling/activity
                  </button>
                </div>

                <button
                  onClick={createPost}
                  disabled={
                    !postText.trim() ||
                    creatingPost
                  }
                  className={`flex items-center gap-2 rounded-lg px-6 py-2 font-semibold text-white ${
                    postText.trim() &&
                    !creatingPost
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-gray-300"
                  }`}
                >
                  <Send size={18} />
                  {creatingPost
                    ? "Posting..."
                    : "Post"}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <Newspaper
                    size={26}
                    className="text-gray-400"
                  />
                </div>

                <h3 className="mb-1 font-semibold text-gray-700">
                  No posts yet
                </h3>

                <p className="text-sm text-gray-500">
                  Be the first one to publish.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {posts.map((post, index) => {
                  const postId = getPostId(post);
                  const editing =
                    editingPostId === postId;
                  const liked =
                    isPostLiked(post);
                  const likesCount =
                    getLikesCount(post);
                  const sharesCount =
                    getSharesCount(post);
                  const myPost =
                    isMyPost(post);

                  return (
                    <article
                      key={postId || index}
                      onClick={() =>
                        !editing &&
                        openPostDetails(post)
                      }
                      className="cursor-pointer rounded-xl bg-white p-5 shadow-sm"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={getPostUserImage(
                              post
                            )}
                            alt="User"
                            className="h-11 w-11 rounded-full object-cover"
                          />

                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {getPostUserName(
                                post
                              )}
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

                        {myPost && (
                          <div className="flex items-center gap-1">
                            {editing ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updatePost(
                                      postId
                                    );
                                  }}
                                  disabled={
                                    updatingPost
                                  }
                                  className="rounded-lg p-2 text-green-600 hover:bg-green-100 disabled:opacity-50"
                                >
                                  <Check
                                    size={18}
                                  />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cancelEditPost();
                                  }}
                                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditPost(
                                      post
                                    );
                                  }}
                                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-100"
                                >
                                  <Pencil
                                    size={18}
                                  />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePost(
                                      postId
                                    );
                                  }}
                                  className="rounded-lg p-2 text-red-600 hover:bg-red-100"
                                >
                                  <Trash2
                                    size={18}
                                  />
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {!myPost && (
                          <button
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                          >
                            <Menu size={20} />
                          </button>
                        )}
                      </div>

                      {editing ? (
                        <textarea
                          value={
                            editingPostText
                          }
                          onChange={(e) =>
                            setEditingPostText(
                              e.target.value
                            )
                          }
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Escape"
                            ) {
                              cancelEditPost();
                            }
                          }}
                          autoFocus
                          className="mb-4 min-h-[110px] w-full resize-none rounded-xl border border-blue-300 bg-white p-4 outline-none focus:border-blue-500"
                        />
                      ) : (
                        <p className="mb-4 whitespace-pre-wrap text-gray-700">
                          {getPostBody(post)}
                        </p>
                      )}

                      {getPostImage(post) && (
                        <img
                          src={getPostImage(post)}
                          alt="Post"
                          className="mb-4 max-h-[500px] w-full rounded-xl object-cover"
                        />
                      )}

                      <div className="flex items-center justify-between border-t pt-3 text-sm text-gray-500">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            likePost(postId);
                          }}
                          disabled={
                            likingPostId ===
                            postId
                          }
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                            liked
                              ? "text-red-500"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          <Heart
                            size={18}
                            fill={
                              liked
                                ? "currentColor"
                                : "none"
                            }
                          />
                          Like
                          {likesCount > 0 && (
                            <span>
                              {likesCount}
                            </span>
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPostDetails(
                              post
                            );
                          }}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
                        >
                          <MessageCircle
                            size={18}
                          />
                          Comments
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sharePost(postId);
                          }}
                          disabled={
                            sharingPostId ===
                            postId
                          }
                          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
                        >
                          <Share2 size={18} />
                          Share
                          {sharesCount > 0 && (
                            <span>
                              {sharesCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-bold text-gray-800">
                  Suggested Friends
                </h2>

                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
                  5
                </span>
              </div>

              <div className="mb-5 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                <Search
                  size={18}
                  className="text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search friends"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <div className="space-y-5">
                {[
                  {
                    name: "Ahmed Abd Al-Muti",
                    username:
                      "@ahmedmutti",
                    followers: 330,
                  },
                  {
                    name: "Alaa Ashraf",
                    username:
                      "@alaaashraf",
                    followers: 268,
                  },
                  {
                    name: "MrMo",
                    username: "@mrmo",
                    followers: 207,
                  },
                  {
                    name: "menna",
                    username:
                      "@gbngssssb",
                    followers: 166,
                  },
                  {
                    name: "abdalla diaa",
                    username:
                      "@abdalla_diaa",
                    followers: 161,
                  },
                ].map((friend) => (
                  <div
                    key={friend.username}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={defaultImage}
                        alt={friend.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-800">
                          {friend.name}
                        </h3>

                        <p className="truncate text-xs text-gray-500">
                          {friend.username}
                        </p>

                        <p className="text-xs text-gray-400">
                          {friend.followers} followers
                        </p>
                      </div>
                    </div>

                    <button className="rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-600 hover:text-white">
                      Follow
                    </button>
                  </div>
                ))}
              </div>

              <button className="mt-6 w-full rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                View more
              </button>
            </div>
          </aside>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto xl:hidden">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Newspaper size={18} />
            Feed
          </button>

          <button className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm text-gray-600">
            <Sparkles size={18} />
            My Posts
          </button>

          <button className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm text-gray-600">
            <Earth size={18} />
            Community
          </button>

          <button className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm text-gray-600">
            <Bookmark size={18} />
            Saved
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-white p-4 shadow-sm xl:hidden">
          <div className="flex items-center gap-3">
            <Users
              size={20}
              className="text-blue-600"
            />

            <div>
              <h3 className="font-semibold text-gray-800">
                Suggested Friends
              </h3>

              <p className="text-xs text-gray-500">
                Connect with people from the
                community
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
