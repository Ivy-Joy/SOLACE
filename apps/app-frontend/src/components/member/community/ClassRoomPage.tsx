"use client";

import { useEffect, useState } from "react";
import memberApi from "@/src/lib/memberApi";
import { Plus, MessageCircle, Sparkles } from "lucide-react";
import ClassChatPanel from "./ClassChatPanel";

type Post = {
  id: string;
  classKey: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt?: string | null;
};

export default function ClassRoomPage({ classKey }: { classKey: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function load() {
    const res = await memberApi.get<{ items: Post[] }>(`/member/classes/${classKey}/posts`);
    setPosts(res.items);
  }

  useEffect(() => {
    void load();
  }, [classKey]);

  async function submitPost() {
    await memberApi.post(`/member/classes/${classKey}/posts`, { title, body });
    setTitle("");
    setBody("");
    await load();
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[34px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{classKey.toUpperCase()} class room</h1>
            </div>

            <div className="mt-5 grid gap-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share an update, testimony, or reflection..."
                rows={5}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
              />
              <button
                type="button"
                onClick={submitPost}
                className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                <Plus size={16} />
                Post to class
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {posts.map((post) => (
              <div key={post.id} className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  {post.pinned ? <span className="rounded-full bg-slate-900 px-2 py-1 text-white">Pinned</span> : null}
                  {post.classKey.toUpperCase()}
                </div>
                <div className="mt-2 text-lg font-bold text-slate-900">{post.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{post.body}</p>
                <div className="mt-3 text-xs text-slate-500">
                  {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <ClassChatPanel classKey={classKey as any} />
          <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <h2 className="text-lg font-bold text-slate-900">Class notes</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This room is private to your approved adult class community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}