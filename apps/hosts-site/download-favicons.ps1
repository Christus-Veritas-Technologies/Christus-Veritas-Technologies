$base = "https://realfavicongenerator.net/files/1c3567f3-d939-4f65-8dfb-8deff8b3003c"
$app  = "$PSScriptRoot\src\app"
$pub  = "$PSScriptRoot\public"

@(
  @{ url = "$base/icon1.png";                   dest = "$app\icon1.png" },
  @{ url = "$base/icon0.svg";                   dest = "$app\icon0.svg" },
  @{ url = "$base/favicon.ico";                 dest = "$app\favicon.ico" },
  @{ url = "$base/apple-icon.png";              dest = "$app\apple-icon.png" },
  @{ url = "$base/manifest.json";               dest = "$app\manifest.json" },
  @{ url = "$base/web-app-manifest-192x192.png";dest = "$pub\web-app-manifest-192x192.png" },
  @{ url = "$base/web-app-manifest-512x512.png";dest = "$pub\web-app-manifest-512x512.png" }
) | ForEach-Object {
  Invoke-WebRequest -Uri $_.url -OutFile $_.dest -UseBasicParsing
  Write-Host "Downloaded: $($_.dest)"
}

Write-Host "`nAll favicon files downloaded successfully!"
