"use client";

import { useEffect, useState } from "react";
import { OpportunitiesTable, Opportunity } from "@sections/OpportunitiesTable";

type OpportunitiesResponse = {
  notices: Opportunity[];
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("/api/opportunities");
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }
        const data: OpportunitiesResponse = await response.json();
        setOpportunities(data.notices);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (isLoading) {
    return (
      <div className="container-responsive py-16">
        <p className="text-muted">Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-responsive py-16">
        <p className="text-sm text-red-600">Failed to load opportunities: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-ocean/5 py-12">
        <div className="container-responsive space-y-4">
          <div className="section-divider" />
          <h1 className="text-3xl font-heading text-slate">Opportunities Dashboard</h1>
          <p className="max-w-2xl text-muted">
            High-confidence tenders from the United Nations marketplace curated for Macmillan Keck. Scores combine
            structured fit (agency, geography, procurement type) with semantic evidence from our project portfolio and
            publications.
          </p>
        </div>
      </section>
      <OpportunitiesTable opportunities={opportunities} minScore={80} />
    </div>
  );
}


