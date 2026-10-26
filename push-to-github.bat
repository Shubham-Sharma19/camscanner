@echo off
cd /d "%~dp0"
if not exist "src" cd /d "C:\Users\Asus\OneDrive\Desktop\Scanner new build"
title Pushing DocMaster Pro to GitHub...
echo ========================================================
echo   Pushing code to https://github.com/Shubham-Sharma19/camscanner ...
echo ========================================================
git push -u origin main
echo.
echo ========================================================
echo   Done! Your latest code has been pushed to GitHub.
echo   Vercel will auto-deploy this in ~40 seconds!
echo ========================================================
pause
