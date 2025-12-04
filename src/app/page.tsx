"use client";

const smsNumber = "+17088784215";
const smsBody = encodeURIComponent(
  "You’re added to Jeff Bartosz’s network. Quality and Service — Best-Tronics."
);

function saveVCardAndText() {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Bartosz;Jeff;;;",
    "FN:Jeff Bartosz",
    "ORG:Best-Tronics Manufacturing Inc.",
    "TITLE:Best-Tronics Manufacturing",
    "TEL;TYPE=CELL,VOICE:+1-708-878-4215",
    "EMAIL;TYPE=INTERNET:jeff@best-tronics.com",
    "NOTE:Quality and Service",
    "END:VCARD",
  ].join("\r\n");

  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Jeff_Bartosz_Best-Tronics.vcf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the download a short moment to register before opening SMS.
  setTimeout(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsLink = `sms:${smsNumber}${isIOS ? "&" : "?"}body=${smsBody}`;
    window.location.href = smsLink;
  }, 400);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const contactDetails = [
  { label: "First Name", value: "Jeff" },
  { label: "Last Name", value: "Bartosz" },
  { label: "Phone", value: "708.878.4215" },
  { label: "Company", value: "Best-Tronics Manufacturing Inc." },
  { label: "Email", value: "jeff@best-tronics.com" },
];

export default function Home() {
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

            <div className="mb-4 grid grid-cols-1 gap-3 text-sm text-zinc-200">
              {contactDetails.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 shadow-inner shadow-black/30"
                >
                  <span className="text-[12px] uppercase tracking-wide text-zinc-400">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-white">{value}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={saveVCardAndText}
              className="jiggle relative flex w-full items-center justify-center gap-3 rounded-2xl border border-[#4cff72]/40 bg-[linear-gradient(135deg,#4cff72,#48e56a)] px-6 py-4 text-lg font-semibold text-[#0a120d] shadow-[0_15px_35px_rgba(76,255,114,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(76,255,114,0.4)] active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4cff72]"
            >
              Save contact & text Jeff
              <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#4cff72]/50 bg-[#0b120e] text-sm font-bold text-[#4cff72] shadow-[0_10px_25px_rgba(76,255,114,0.25)]">
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(76,255,114,0.18),transparent_60%)]" />
                +
              </span>
            </button>
          </div>
        </main>

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
