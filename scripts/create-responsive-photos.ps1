Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
function Export-Variants([string]$sourcePath, [string]$outputFolder, [string]$stem, [int[]]$widths) {
  [System.IO.Directory]::CreateDirectory($outputFolder) | Out-Null
  $image = [System.Drawing.Image]::FromFile($sourcePath)
  try {
    if ($image.PropertyIdList -contains 274) {
      $orientation = [BitConverter]::ToUInt16($image.GetPropertyItem(274).Value, 0)
      $rotation = @{ 2=4; 3=2; 4=6; 5=5; 6=1; 7=7; 8=3 }
      if ($rotation.ContainsKey([int]$orientation)) { $image.RotateFlip([System.Drawing.RotateFlipType]$rotation[[int]$orientation]) }
    }
    foreach ($width in $widths) {
      if ($width -gt $image.Width) { throw "Refusing to upscale $sourcePath to $width" }
      $height = [int][Math]::Round($image.Height * $width / $image.Width)
      $bitmap = New-Object System.Drawing.Bitmap($width, $height)
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($image, 0, 0, $width, $height)
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
        $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
        try {
          $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)
          $target = Join-Path $outputFolder "$stem-$width.jpg"
          $bitmap.Save($target, $encoder, $parameters)
          Write-Output "$target ($((Get-Item -LiteralPath $target).Length) bytes)"
        } finally { $parameters.Dispose() }
      } finally { $graphics.Dispose(); $bitmap.Dispose() }
    }
  } finally { $image.Dispose() }
}
$photos = Join-Path $projectRoot 'public/images/anh-cuoi'
Export-Variants (Join-Path $photos 'dau-thiep/o-giua.jpg') (Join-Path $photos 'dau-thiep/responsive') 'hero' @(480,960,1440,2700)
1..6 | ForEach-Object { Export-Variants (Join-Path $photos "album/anh_$_.jpg") (Join-Path $photos 'album/responsive') "anh_$_" @(960,1920) }
