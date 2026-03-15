"use client";

import { FormEvent, useMemo, useState } from "react";

const smsNumber = "+17088784215";
const jeffVCardUrl = "/api/contact/jeff";
const initialForm = {
  fullName: "",
  email: "",
  phone: "",
};

function encodeSharedContactPayload(value: typeof initialForm) {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function openJeffContactDownload() {
  const anchor = document.createElement("a");
  anchor.href = jeffVCardUrl;
  anchor.download = "Jeff_Bartosz_Best-Tronics.vcf";
  anchor.rel = "noopener";
  anchor.target = "_blank";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [origin] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );

  const shareableContactPath = useMemo(() => {
    if (!form.email.trim() || !form.phone.trim()) {
      return "";
    }

    const token = encodeSharedContactPayload(form);
    return `/api/contact/share/${token}`;
  }, [form]);

  const shareableContactUrl = origin && shareableContactPath ? `${origin}${shareableContactPath}` : "";

  function handleSaveContact() {
    openJeffContactDownload();
    setTimeout(() => {
      setIsComposerOpen(true);
    }, 350);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!email || !phone) {
      setErrorMessage("Enter both your email and phone number.");
      return;
    }

    const smsBody = [
      "Hi Jeff, I just saved your contact.",
      `Name: ${form.fullName.trim() || "Shared Contact"}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      "Save my contact:",
      `${window.location.origin}${shareableContactPath}`,
    ].join("\n");

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsLink = `sms:${smsNumber}${isIOS ? "&" : "?"}body=${encodeURIComponent(smsBody)}`;
    setErrorMessage("");
    setIsComposerOpen(false);
    window.location.href = smsLink;
  }

  return (
    <div className="page-bg flex min-h-screen items-center justify-center px-5 py-10">
      <div className="relative w-full max-w-md">
        <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(76,255,114,0.35),transparent_55%)] blur-2xl" />
        <div className="absolute -right-14 top-20 h-32 w-32 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,255,114,0.22),transparent_55%)] blur-3xl" />

        <main className="card-3d relative overflow-hidden rounded-[24px] border border-white/5 p-6">
          <div className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-[linear-gradient(90deg,#4cff72,rgba(76,255,114,0.05))]" />
          <div className="absolute inset-0 opacity-20 [background:linear-gradient(120deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.01)_25%,transparent_40%,rgba(255,255,255,0.02)_60%,rgba(255,255,255,0.04)_100%)]" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.25em] text-zinc-300 backdrop-blur">
                Network Ready
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(76,255,114,0.12)] px-3 py-1 text-[11px] font-medium text-[#4cff72]">
                <span className="h-2 w-2 rounded-full bg-[#4cff72] shadow-[0_0_0_6px_rgba(76,255,114,0.15)]" />
                Live Contact
              </span>
            </div>

            <button
              type="button"
              onClick={handleSaveContact}
              className="jiggle relative flex w-full items-center justify-center gap-3 rounded-2xl border border-[#4cff72]/40 bg-[linear-gradient(135deg,#4cff72,#48e56a)] px-6 py-4 text-lg font-semibold text-[#0a120d] shadow-[0_15px_35px_rgba(76,255,114,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(76,255,114,0.4)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4cff72]"
            >
              Save contact & text Jeff
              <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#4cff72]/50 bg-[#0b120e] text-sm font-bold text-[#4cff72] shadow-[0_10px_25px_rgba(76,255,114,0.25)]">
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(76,255,114,0.18),transparent_60%)]" />
                +
              </span>
            </button>
            <p className="mt-4 text-center text-sm text-zinc-400">
              Saves Jeff&apos;s contact first, then opens an optional text form with your details prebuilt.
            </p>
          </div>
        </main>

        {isComposerOpen ? (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-[linear-gradient(165deg,#181d21,#0f1316_68%,#0b0e11)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#4cff72]">
                    Optional Text
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Send Jeff your details
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Enter your info and we&apos;ll open your SMS app with a Samsung-friendly
                    share link that also imports cleanly into iOS Contacts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("");
                    setIsComposerOpen(false);
                  }}
                  className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
                >
                  Not now
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-200">Name</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                    placeholder="Optional, helps label your shared contact"
                    className="form-input"
                    autoComplete="name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-200">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="you@company.com"
                    className="form-input"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-200">Phone number</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    placeholder="(555) 555-5555"
                    className="form-input"
                    autoComplete="tel"
                    required
                  />
                </label>

                {shareableContactUrl ? (
                  <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Shareable contact link</p>
                    <p className="mt-2 break-all text-sm leading-6 text-zinc-300">
                      {shareableContactUrl}
                    </p>
                  </div>
                ) : null}

                {errorMessage ? (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-2xl border border-[#4cff72]/40 bg-[linear-gradient(135deg,#4cff72,#48e56a)] px-5 py-3 text-base font-semibold text-[#0a120d] shadow-[0_15px_35px_rgba(76,255,114,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(76,255,114,0.32)]"
                >
                  Open text message
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <footer className="mt-7 space-y-1 text-center text-xs text-zinc-400">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
            Built in America, on earth.
          </p>
          <p className="italic text-zinc-400">
            Making relationships built to last, the American Way.
          </p>
        </footer>
      </div>
    </div>
  );
}
