import { UUID } from "crypto";
import { NextResponse } from "next/server";
import { QueryTypes } from "sequelize";

import { config } from "../../../../lib/config";
import { databasePool } from "../../../../lib/db/DatabasePool";
import { UrlMappingResponse } from "../../../../lib/definitions/UrlMappingResponse";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mapId: UUID }> },
) {
  try {
    const { mapId } = await params;
    if (!mapId) {
      return new Response("Mapping ID not provided.", { status: 400 });
    }
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

    return new NextResponse(
      JSON.stringify({
        settings_url: settingsURL,
        content_url: contentURL,
      } satisfies UrlMappingResponse),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
