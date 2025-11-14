 "use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export const HeroVisual = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex justify-center">
      <div className="absolute inset-0 -translate-y-10 translate-x-6 rounded-full bg-ocean/10 blur-3xl" />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-br from-white/90 via-ocean/10 to-slate/10 p-6 shadow-card">
        <div className="space-y-4 text-slate">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-ocean">Markets advised</p>
              <p className="text-3xl font-semibold">80+</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ocean">Focus areas</p>
              <p className="text-3xl font-semibold">DFS · ID · Infra</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/70 p-4 text-sm text-muted">
            <p>
              Regulatory architecture for cross-border connectivity, digital financial services, and national digital ID
              systems built on practical precedents and frontline programme delivery.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group mt-6 block w-full overflow-hidden rounded-2xl border border-white/40 bg-white/80 transition-transform hover:-translate-y-1 hover:shadow-lg"
        >
          <Image
            src="/assets/world-network.gif"
            alt="Digital economy capabilities map"
            width={640}
            height={640}
            className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            priority
          />
        </button>
      </div>

      <div
        className={clsx(
          "pointer-events-none fixed inset-0 z-[70] bg-slate/60 opacity-0 transition-opacity duration-300 ease-out",
          isOpen && "pointer-events-auto opacity-100"
        )}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={clsx(
          "pointer-events-none fixed inset-0 z-[70] flex items-center justify-center p-6 opacity-0 transition duration-300 ease-out",
          isOpen && "pointer-events-auto opacity-100"
        )}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={clsx(
            "max-w-5xl flex-1 rounded-3xl border border-white/30 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out",
            isOpen ? "translate-y-0 scale-100" : "translate-y-6 scale-95"
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between text-white">
            <div>
              <p className="text-sm uppercase tracking-wide text-ocean/80">Macmillan Keck</p>
              <h3 className="text-2xl font-semibold">Digital Economy Delivery Map</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/80 transition-colors hover:bg-white/20"
          >
            Close
          </button>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/20 bg-slate-800">
            <Image
              src="/assets/world-network.gif"
              alt="Digital economy capabilities map"
              width={1280}
              height={1280}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

