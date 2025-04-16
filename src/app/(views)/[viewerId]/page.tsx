"use client";
import { useParams } from "next/navigation";
import { UUID } from "node:crypto";
import React, { useEffect } from "react";

import { UrlMappingResponse } from "../../lib/definitions/UrlMappingResponse";

export default function ViewerPage() {
  const [viewerRoute, setViewerRoute] = React.useState<string>(null);
  const [viewerFailed, setViewerFailed] = React.useState<boolean>(false);
  const viewerId: UUID = useParams<{ viewerId: UUID }>().viewerId;

  useEffect(() => {
    // Your effect logic here
    fetch(`/api/v1/url-mapping/${viewerId}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const urlMapping: UrlMappingResponse = await res.json();
        const viewerPath = `dist/index.html?settings=${urlMapping.settings_url}&content=${urlMapping.content_url}`;
        setViewerRoute(viewerPath);
      })
      .catch((error) => {
        console.error(error);
        setViewerFailed(true);
      });
  });

  return (
    <>
      <div className="flex justify-center items-center overflow-hidden min-h-screen min-w-screen">
        {viewerRoute && viewerRoute !== null ? (
          <iframe
            className="min-h-screen min-w-screen w-full h-full relative"
            src={viewerRoute}
            allow="fullscreen"
            loading="lazy"
          />
        ) : viewerFailed ? (
          <div>Could not load viewer</div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}
