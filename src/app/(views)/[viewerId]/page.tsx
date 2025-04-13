"use client";
import { useParams } from "next/navigation";
import { UUID } from "node:crypto";
import React, { useEffect } from "react";

import { UrlMappingResponse } from "../../lib/models/UrlMappingResponse";

export default function ViewerPage() {
  const [viewerURL, setViewerURL] = React.useState<URL>(null);
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
        const viewerURL = new URL(urlMapping.viewer_url);
        setViewerURL(viewerURL);
      })
      .catch((error) => {
        console.error(error);
        setViewerFailed(true);
      });
  }, []);

  return (
    <>
      <div className="viewer-wrapper">
        {viewerURL && viewerURL !== null ? (
          <iframe src={viewerURL.toString()} />
        ) : viewerFailed ? (
          <div>Could not load viewer</div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}
