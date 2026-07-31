"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { db, auth, onAuthStateChanged } from "../../lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { createSocialPost, togglePostLike, fetchFromAPI } from "../../lib/api";
import { generateSafariUsername } from "../../lib/usernames";
import AuthModal from "../../components/auth/AuthModal";
import { 
  Heart, Sparkles, PlusCircle, Upload, MapPin, X, Film, CheckCircle2 
} from "lucide-react";
import { triggerHaptic } from "../../lib/sound";

export default function SocialFeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [parks, setParks] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [uniqueUsername, setUniqueUsername] = useState("@WildTracker123");

  const [postForm, setPostForm] = useState({
    caption: "",
    park_name: "Bandhavgarh National Park",
    media_type: "image",
    media_base64: "",
  });
  const [postSubmitting, setPostSubmitting] = useState(false);

  useEffect(() => {
    setUniqueUsername(generateSafariUsername());
    fetchFromAPI("/parks").then((data) => setParks(data || []));
  }, []);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  // Real-time Cloud Firestore listener for Social Safari Posts
  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsubPosts = onSnapshot(q, (snapshot) => {
      const livePosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(livePosts);
    });

    return () => unsubPosts();
  }, []);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith("video/");
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostForm(prev => ({
          ...prev,
          media_type: isVid ? "video" : "image",
          media_base64: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!postForm.media_base64) {
      alert("Please select a photo or short video to share.");
      return;
    }

    setPostSubmitting(true);
    try {
      await createSocialPost({
        ...postForm,
        username: uniqueUsername,
        user_uid: currentUser.uid,
        user_display_name: currentUser.displayName || currentUser.email?.split("@")[0],
      });
      setIsCreateModalOpen(false);
      setPostForm({
        caption: "",
        park_name: "Bandhavgarh National Park",
        media_type: "image",
        media_base64: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setPostSubmitting(false);
    }
  };

  const handleLike = (postId: string) => {
    triggerHaptic(12);
    togglePostLike(postId);
  };

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Feed Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-orange-500 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" /> Community Moments
          </span>
          <h1 className="text-3xl font-black text-white mt-1">Safari Feed</h1>
        </div>

        <button
          onClick={() => {
            triggerHaptic(12);
            if (!currentUser) setIsAuthModalOpen(true);
            else setIsCreateModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-400 text-black font-extrabold px-5 py-2.5 rounded-full text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Share Safari Moment
        </button>
      </div>

      {/* User Random Username Badge */}
      <div className="bg-zinc-950 border border-white/10 p-4 rounded-2xl flex justify-between items-center text-xs">
        <span className="text-zinc-400">Your Assigned Unique Handle:</span>
        <span className="text-orange-400 font-mono font-bold bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
          {uniqueUsername}
        </span>
      </div>

      {/* Safari Feed Posts */}
      <div className="space-y-8">
        {posts.length === 0 ? (
          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-12 text-center space-y-4">
            <Film className="w-12 h-12 text-orange-500 mx-auto" />
            <p className="text-zinc-400 text-sm">Be the first to share a safari photo or short video!</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-orange-500 text-black font-extrabold px-6 py-3 rounded-full text-xs"
            >
              Share First Safari Post
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-3">
              <div className="p-4 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-xs">
                    🐅
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">{post.username || "@WildTracker"}</p>
                    <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-500" /> {post.park_name || "Bandhavgarh National Park"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative w-full max-h-[480px] bg-black overflow-hidden flex items-center justify-center">
                {post.media_type === "video" ? (
                  <video src={post.media_base64} controls className="w-full max-h-[480px] object-contain" />
                ) : (
                  <img src={post.media_base64 || post.media_url} alt="Safari Moment" className="w-full max-h-[480px] object-cover" />
                )}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-300">
                  <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>{post.likes_count || 0} Likes</span>
                  </button>

                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500 text-[10px]">Verified Safari Experience</span>
                </div>

                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  <strong className="text-white mr-1.5">{post.username}</strong>
                  {post.caption}
                </p>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Post Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-zinc-950 border border-white/15 w-full max-w-md rounded-3xl p-6 relative text-white shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setIsCreateModalOpen(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-orange-500 font-bold">Posting as {uniqueUsername}</span>
              <h3 className="text-2xl font-black text-white">Share Safari Moment</h3>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Select National Park</label>
                <select
                  value={postForm.park_name}
                  onChange={(e) => setPostForm({ ...postForm, park_name: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white"
                >
                  {parks.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <textarea
                placeholder="Write your safari experience, tiger sighting story or moment..."
                rows={3}
                required
                value={postForm.caption}
                onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
              />

              <div className="border border-dashed border-white/20 p-4 rounded-2xl text-center space-y-2">
                <Upload className="w-6 h-6 text-orange-500 mx-auto" />
                <p className="text-zinc-300 font-semibold">Attach Photo or Short Video</p>
                <input
                  type="file"
                  accept="image/*,video/mp4,video/webm"
                  required
                  onChange={handleMediaUpload}
                  className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-orange-500 file:text-black file:font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={postSubmitting || !postForm.media_base64}
                className="w-full bg-orange-500 text-black font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {postSubmitting ? "Publishing to Feed..." : "Publish Safari Moment"}
              </button>
            </form>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={(u: any) => setCurrentUser(u)} />
    </main>
  );
}
