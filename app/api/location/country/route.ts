import {
  NextResponse,
} from 'next/server'

export async function GET(
  request: Request,
) {
  const countryCode =
    request.headers.get(
      'x-vercel-ip-country',
    ) ||
    request.headers.get(
      'cf-ipcountry',
    ) ||
    null

  return NextResponse.json({
    countryCode:
      countryCode
        ?.trim()
        .toUpperCase() ||
      null,
  })
}