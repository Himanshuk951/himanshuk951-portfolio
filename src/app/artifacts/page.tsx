"use client";

import { Suspense } from "react";
import ArtifactsHUD from "@/components/ArtifactsHUD";

export default function ArtifactsPage() {
    return (
        <Suspense fallback={<main className="min-h-screen bg-[#050505]" />}>
            <ArtifactsHUD />
        </Suspense>
    );
}
