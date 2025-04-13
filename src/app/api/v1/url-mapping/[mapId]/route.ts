import { UUID } from "crypto";
import { QueryTypes } from "sequelize";
import { NextResponse } from "next/server";

import { databasePool, DatabasePool } from "../../../../lib/db/DatabasePool";
import { config } from "../../../../lib/config";
import { UrlMappingResponse } from "../../../../lib/models/UrlMappingResponse";

export async function GET(
  request: Request,
  { params }: { params: { mapId: UUID } },
) {
  try {
    const { mapId } = await params;
    const results = await databasePool.client.query(
      "SELECT key FROM assets WHERE id = $1 AND type = 'viewer' LIMIT 1",
      { bind: [mapId], type: QueryTypes.SELECT },
    );
    if (!results || !results[0]) {
      return new Response("Not Found", { status: 404 });
    }

    const key: string = JSON.parse(JSON.stringify(results[0])).key;
    if (!key || key === "") {
      throw new Error("Key is not set");
    }

    const settingsURL: URL = new URL(
      `${config.AWS_S3_CLOUDFRONT_URL}/${key}/settings.json`,
    );
    const contentURL: URL = new URL(
      `${config.AWS_S3_CLOUDFRONT_URL}/${key}/scene.compressed.ply`,
    );

    const viewerURL: URL = new URL(
      `${config.AWS_S3_CLOUDFRONT_URL}/dev/dist/index.html?settings=${settingsURL}&content=${contentURL}`,
    );

    return new NextResponse(
      JSON.stringify({
        viewer_url: viewerURL.toString(),
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
