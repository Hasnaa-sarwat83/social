import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  House,
  User,
  MessageCircle,
  Menu,
  Camera,
  Expand,
  Users,
  Mail,
  FileText,
  Bookmark,
  Heart,
  MessageCircle as CommentIcon,
  Share2,
} from "lucide-react";
import api from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const defaultImage =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

  const [user, setUser] = useState({
    name: "Hasnaa sarwat",
    username: "hasnaa2027",
    email: "h.sarwat0321@nub.edu.eg",
  });

  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};

    try {
      const profileResponse = await api.get(
        "/users/profile-data",
        { headers }
      );

      const responseData = profileResponse?.data?.data;

      const profileUser =
        responseData?.user ||
        responseData?.data?.user ||
        responseData;

      if (profileUser) {
        setUser((oldUser) => ({
          ...oldUser,
          ...profileUser,
        }));

        const photo =
          profileUser?.photo ||
          profileUser?.profilePhoto ||
          profileUser?.image ||
          profileUser?.avatar;

        const cover =
          profileUser?.cover ||
          profileUser?.coverPhoto ||
          profileUser?.coverImage;

        if (photo) {
          setProfileImage(photo);
        }

        if (cover) {
          setCoverImage(cover);
        }

        const saved =
          profileUser?.savedPosts ||
          responseData?.savedPosts ||
          [];

        if (Array.isArray(saved)) {
          setSavedPosts(saved);
        }
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const postsResponse = await api.get(
        "/posts/feed?page=1&limit=100",
        { headers }
      );

      const responseData = postsResponse?.data?.data;

      let allPosts = [];

      if (Array.isArray(responseData)) {
        allPosts = responseData;
      } else if (Array.isArray(responseData?.posts)) {
        allPosts = responseData.posts;
      } else if (Array.isArray(responseData?.data)) {
        allPosts = responseData.data;
      }

      const currentUserId =
        user?._id ||
        user?.id ||
        user?.userId;

      if (currentUserId) {
        const myPosts = allPosts.filter((post) => {
          const postUserId =
            post?.user?._id ||
            post?.user?.id ||
            post?.author?._id ||
            post?.author?.id ||
            post?.userId;

          return (
            postUserId &&
            String(postUserId) === String(currentUserId)
          );
        });

        setPosts(myPosts);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const getUserName = () => {
    return user?.name || user?.username || "Hasnaa sarwat";
  };

  const getUsername = () => {
    const username = user?.username || "hasnaa2027";

    return username.startsWith("@")
      ? username
      : `@${username}`;
  };

  const getEmail = () => {
    return user?.email || "h.sarwat0321@nub.edu.eg";
  };

  const getFollowers = () => {
    if (Array.isArray(user?.followers)) {
      return user.followers.length;
    }

    return user?.followersCount || 0;
  };

  const getFollowing = () => {
    if (Array.isArray(user?.following)) {
      return user.following.length;
    }

    return user?.followingCount || 0;
  };

  const getPostId = (post) => {
    return post?._id || post?.id;
  };

  const getPostBody = (post) => {
    return (
      post?.body ||
      post?.content ||
      post?.text ||
      ""
    );
  };

  const getPostImage = (post) => {
    return (
      post?.image ||
      post?.imageUrl ||
      post?.photo ||
      null
    );
  };

  const getLikesCount = (post) => {
    if (Array.isArray(post?.likes)) {
      return post.likes.length;
    }

    return post?.likesCount || post?.likeCount || 0;
  };

  const getCommentsCount = (post) => {
    if (Array.isArray(post?.comments)) {
      return post.comments.length;
    }

    return post?.commentsCount || post?.commentCount || 0;
  };

  const getSharesCount = (post) => {
    if (Array.isArray(post?.shares)) {
      return post.shares.length;
    }

    return post?.sharesCount || post?.shareCount || 0;
  };

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProfileImage(URL.createObjectURL(file));
  };

  const handleCoverImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCoverImage(URL.createObjectURL(file));
  };

  const openPost = (post) => {
    const id = getPostId(post);

    if (id) {
      navigate(`/post/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
          <div className="flex items-center gap-3">
            <img
              src="/route.png"
              alt="Route Posts"
              className="h-9 w-9 rounded-xl object-cover"
            />

            <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
              Route Posts
            </p>
          </div>

          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
            <button
              onClick={() => navigate("/")}
              className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold text-slate-600 transition hover:bg-white/90 hover:text-slate-900 sm:gap-2 sm:px-3.5"
            >
              <House size={20} />
              <span className="hidden sm:inline">
                Feed
              </span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="relative flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-2 text-sm font-extrabold text-[#1f6fe5] shadow-sm sm:gap-2 sm:px-3.5"
            >
              <User size={20} />
              <span className="hidden sm:inline">
                Profile
              </span>
            </button>

            <button
              className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold text-slate-600 transition hover:bg-white/90 hover:text-slate-900 sm:gap-2 sm:px-3.5"
            >
              <MessageCircle size={20} />
              <span className="hidden sm:inline">
                Notifications
              </span>
            </button>
          </nav>

          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100">
            <img
              src={profileImage}
              alt={getUserName()}
              className="h-8 w-8 rounded-full object-cover"
            />

            <span className="hidden max-w-[140px] truncate text-sm font-semibold text-slate-800 md:block">
              {getUserName()}
            </span>

            <Menu
              size={15}
              className="text-slate-500"
            />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <main>
          <div className="space-y-5 sm:space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
              <div className="relative h-44 bg-[linear-gradient(112deg,#0f172a_0%,#1e3a5f_36%,#2b5178_72%,#5f8fb8_100%)] sm:h-52 lg:h-60">
                {coverImage && (
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,.14)_0%,rgba(255,255,255,0)_36%)]" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(186,230,253,.22)_0%,rgba(186,230,253,0)_44%)]" />

                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/25 to-transparent" />

                <label className="absolute right-2 top-2 inline-flex cursor-pointer items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur transition hover:bg-black/60 sm:right-3 sm:top-3 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                  <Camera size={13} />
                  Add cover
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImage}
                  />
                </label>
              </div>

              <div className="relative -mt-12 px-3 pb-5 sm:-mt-16 sm:px-8 sm:pb-6">
                <div className="rounded-3xl border border-white/60 bg-white/90 p-5 backdrop-blur-xl sm:p-7">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-end gap-4">
                        <div className="relative shrink-0">
                          <img
                            src={profileImage}
                            alt={getUserName()}
                            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md ring-2 ring-[#dbeafe]"
                          />

                          <button className="absolute bottom-1 left-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1877f2] shadow-sm ring-1 ring-slate-200">
                            <Expand size={16} />
                          </button>

                          <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white shadow-sm transition hover:bg-[#166fe5]">
                            <Camera size={17} />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProfileImage}
                            />
                          </label>
                        </div>

                        <div className="min-w-0 pb-1">
                          <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                            {getUserName()}
                          </h2>

                          <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                            {getUsername()}
                          </p>

                          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                            <Users size={13} />
                            Route Posts member
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid w-full grid-cols-3 gap-2 lg:w-[520px]">
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                          Followers
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                          {getFollowers()}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                          Following
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                          {getFollowing()}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                          Bookmarks
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                          {savedPosts.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <h3 className="text-sm font-extrabold text-slate-800">
                        About
                      </h3>

                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <p className="flex items-center gap-2">
                          <Mail
                            size={15}
                            className="text-slate-500"
                          />
                          {getEmail()}
                        </p>

                        <p className="flex items-center gap-2">
                          <Users
                            size={15}
                            className="text-slate-500"
                          />
                          Active on Route Posts
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                          My posts
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900">
                          {posts.length}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#1f4f96]">
                          Saved posts
                        </p>
                        <p className="mt-1 text-2xl font-black text-slate-900">
                          {savedPosts.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5 sm:inline-flex sm:w-auto sm:gap-0">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                      activeTab === "posts"
                        ? "bg-white text-[#1877f2] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <FileText size={15} />
                    My Posts
                  </button>

                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                      activeTab === "saved"
                        ? "bg-white text-[#1877f2] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Bookmark size={15} />
                    Saved
                  </button>
                </div>

                <span className="rounded-full bg-[#e7f3ff] px-3 py-1 text-xs font-bold text-[#1877f2]">
                  {activeTab === "posts"
                    ? posts.length
                    : savedPosts.length}
                </span>
              </div>

              {loading ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                  Loading profile...
                </div>
              ) : activeTab === "posts" ? (
                posts.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    You have not posted yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {posts.map((post) => (
                      <article
                        key={getPostId(post)}
                        onClick={() => openPost(post)}
                        className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <img
                            src={profileImage}
                            alt={getUserName()}
                            className="h-11 w-11 rounded-full object-cover"
                          />

                          <div>
                            <h3 className="font-bold text-slate-800">
                              {getUserName()}
                            </h3>

                            <p className="text-xs text-slate-500">
                              {post?.createdAt
                                ? new Date(
                                    post.createdAt
                                  ).toLocaleString()
                                : "Recently"}
                            </p>
                          </div>
                        </div>

                        <p className="mb-4 whitespace-pre-wrap text-slate-700">
                          {getPostBody(post)}
                        </p>

                        {getPostImage(post) && (
                          <img
                            src={getPostImage(post)}
                            alt="Post"
                            className="mb-4 max-h-[500px] w-full rounded-xl object-cover"
                          />
                        )}

                        <div className="flex items-center gap-5 border-t pt-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Heart size={17} />
                            {getLikesCount(post)}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <CommentIcon size={17} />
                            {getCommentsCount(post)}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Share2 size={17} />
                            {getSharesCount(post)}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )
              ) : savedPosts.length === 0 ? (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  You have no saved posts.
                </p>
              ) : (
                <div className="space-y-3">
                  {savedPosts.map((post) => (
                    <article
                      key={getPostId(post)}
                      onClick={() => openPost(post)}
                      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <p className="whitespace-pre-wrap text-slate-700">
                        {getPostBody(post)}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Profile;