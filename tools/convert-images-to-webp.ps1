Param(
    [string]$SourceFolder = "..\\Images",
    [int]$Quality = 80
)

Write-Host "=== Dark Pro - Batch WebP Converter ==="
Write-Host "Source folder:" (Resolve-Path $SourceFolder)
Write-Host "Quality:" $Quality

if (-not (Test-Path $SourceFolder)) {
    Write-Error "Source folder not found: $SourceFolder"
    exit 1
}

# Detect available converter: ImageMagick (magick) or Google cwebp
$hasMagick = (Get-Command magick -ErrorAction SilentlyContinue) -ne $null
$hasCwebp  = (Get-Command cwebp  -ErrorAction SilentlyContinue) -ne $null

if (-not $hasMagick -and -not $hasCwebp) {
    Write-Warning "Na 'magick' (ImageMagick) mila, na 'cwebp' (Google WebP tools)."
    Write-Warning "Please install one of these first, phir script dubara chalayein."
    Write-Host ""
    Write-Host "Suggestions:"
    Write-Host " - ImageMagick: https://imagemagick.org/script/download.php"
    Write-Host " - WebP tools: https://developers.google.com/speed/webp/download"
    exit 1
}

$images = Get-ChildItem -Path $SourceFolder -Recurse -Include *.jpg, *.jpeg, *.png -File

if (-not $images) {
    Write-Host "Koi .jpg/.jpeg/.png files nahi milin is folder me."
    exit 0
}

Write-Host ""
Write-Host ("Found {0} images. Converting to .webp (non-destructive)..." -f $images.Count)
Write-Host ""

foreach ($img in $images) {
    $outPath = [System.IO.Path]::ChangeExtension($img.FullName, ".webp")

    if (Test-Path $outPath) {
        Write-Host "[SKIP] WebP already exists:" $outPath
        continue
    }

    Write-Host "[CONVERT]" $img.FullName "->" $outPath

    if ($hasMagick) {
        # ImageMagick conversion
        magick "$($img.FullName)" -quality $Quality "$outPath"
    }
    elseif ($hasCwebp) {
        # Google WebP tools conversion
        cwebp -q $Quality "$($img.FullName)" -o "$outPath"
    }
}

Write-Host ""
Write-Host "Conversion complete. Originals safe hain; .webp copies Images folder ke andar ban gayi hain."
Write-Host "Aap chahein to future me thumbnails/originals ko directly .webp par point kar sakte hain."

