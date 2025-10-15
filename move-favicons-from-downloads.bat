@echo off
echo ================================================
echo Moving Favicon Files from Downloads to Public
echo ================================================
echo.

set "downloads=%USERPROFILE%\Downloads"
set "public=%~dp0public"

echo Checking Downloads folder: %downloads%
echo Target folder: %public%
echo.

if exist "%downloads%\favicon-16.png" (
    move /Y "%downloads%\favicon-16.png" "%public%\favicon-16.png"
    echo [OK] Moved favicon-16.png
) else (
    echo [SKIP] favicon-16.png not found in Downloads
)

if exist "%downloads%\favicon-32.png" (
    move /Y "%downloads%\favicon-32.png" "%public%\favicon-32.png"
    echo [OK] Moved favicon-32.png
) else (
    echo [SKIP] favicon-32.png not found in Downloads
)

if exist "%downloads%\apple-touch-icon.png" (
    move /Y "%downloads%\apple-touch-icon.png" "%public%\apple-touch-icon.png"
    echo [OK] Moved apple-touch-icon.png
) else (
    echo [SKIP] apple-touch-icon.png not found in Downloads
)

if exist "%downloads%\icon-192.png" (
    move /Y "%downloads%\icon-192.png" "%public%\icon-192.png"
    echo [OK] Moved icon-192.png
) else (
    echo [SKIP] icon-192.png not found in Downloads
)

if exist "%downloads%\icon-512.png" (
    move /Y "%downloads%\icon-512.png" "%public%\icon-512.png"
    echo [OK] Moved icon-512.png
) else (
    echo [SKIP] icon-512.png not found in Downloads
)

echo.
echo ================================================
echo Done! Check the results above.
echo ================================================
echo.
echo Files in public folder:
dir /b "%public%\*.png"
echo.
pause
