$ErrorActionPreference = "Stop"

$CHROME = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$SCREENSHOT_DIR = "C:\Users\USER\Documents\mudrakosh\docs\screenshots"
$UD = "C:\Users\USER\Documents\mudrakosh\docs\screenshots\ud"

if (!(Test-Path $SCREENSHOT_DIR)) {
    New-Item -ItemType Directory -Path $SCREENSHOT_DIR -Force
}

# Start static preview server in background
Write-Host "Starting Vite preview servers..."
$frontendProc = Start-Process -FilePath "npm.cmd" -ArgumentList @("--prefix", "apps/frontend", "run", "preview", "--", "--port", "4173") -PassThru
$mobileProc = Start-Process -FilePath "npm.cmd" -ArgumentList @("--prefix", "apps/mobile", "run", "preview", "--", "--port", "4174") -PassThru

Start-Sleep -Seconds 3

$desktopScreens = @(
    @{ name = "01_secure_login_gateway.png"; url = "http://localhost:4173/?auth=false"; w = 1280; h = 850 },
    @{ name = "02_executive_dashboard.png"; url = "http://localhost:4173/?tab=dashboard"; w = 1280; h = 900 },
    @{ name = "03_perpetual_stock_ledger.png"; url = "http://localhost:4173/?tab=stock"; w = 1280; h = 900 },
    @{ name = "04_inward_grn_wizard.png"; url = "http://localhost:4173/?tab=inward"; w = 1280; h = 900 },
    @{ name = "05_press_floor_spoilage.png"; url = "http://localhost:4173/?tab=press"; w = 1280; h = 900 },
    @{ name = "06_department_indents.png"; url = "http://localhost:4173/?tab=indents"; w = 1280; h = 900 },
    @{ name = "07_dispatch_echallan.png"; url = "http://localhost:4173/?tab=dispatch"; w = 1280; h = 900 },
    @{ name = "08_statutory_reports.png"; url = "http://localhost:4173/?tab=reports"; w = 1280; h = 900 },
    @{ name = "09_alerts_center.png"; url = "http://localhost:4173/?tab=alerts"; w = 1280; h = 900 }
)

$mobileScreens = @(
    @{ name = "m01_warehouse_qr_scanner.png"; url = "http://localhost:4174/?tab=scanner"; w = 420; h = 880 },
    @{ name = "m02_gate_pass_weighbridge.png"; url = "http://localhost:4174/?tab=gate"; w = 420; h = 880 },
    @{ name = "m03_driver_manifest.png"; url = "http://localhost:4174/?tab=manifest"; w = 420; h = 880 },
    @{ name = "m04_proof_of_delivery_pod.png"; url = "http://localhost:4174/?tab=pod"; w = 420; h = 880 }
)

foreach ($s in $desktopScreens) {
    $out = Join-Path $SCREENSHOT_DIR $s.name
    Write-Host "Capturing $($s.name)..."
    Start-Process -FilePath $CHROME -ArgumentList @(
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--hide-scrollbars",
        "--user-data-dir=$UD",
        "--screenshot=$out",
        "--window-size=$($s.w),$($s.h)",
        $s.url
    ) -Wait
}

foreach ($s in $mobileScreens) {
    $out = Join-Path $SCREENSHOT_DIR $s.name
    Write-Host "Capturing $($s.name)..."
    Start-Process -FilePath $CHROME -ArgumentList @(
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--hide-scrollbars",
        "--user-data-dir=$UD",
        "--screenshot=$out",
        "--window-size=$($s.w),$($s.h)",
        $s.url
    ) -Wait
}

Write-Host "Stopping servers..."
Stop-Process -Id $frontendProc.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $mobileProc.Id -Force -ErrorAction SilentlyContinue

Write-Host "Done! All screenshots captured."
