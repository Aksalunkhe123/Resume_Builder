@echo off
REM Install AI parser dependencies (workaround for OneDrive node_modules sync issues)
set TEMP_DEPS=%TEMP%\skillbridge-deps
set BACKEND=%~dp0

echo Installing parser packages to temp folder...
if exist "%TEMP_DEPS%" rmdir /s /q "%TEMP_DEPS%"
mkdir "%TEMP_DEPS%"
cd /d "%TEMP_DEPS%"
call npm init -y >nul 2>&1
call npm install mammoth@1.8.0 pdf-parse@1.1.1 @google/generative-ai@0.21.0
if errorlevel 1 (
  echo npm install failed!
  exit /b 1
)

echo Copying packages to backend node_modules...
robocopy "%TEMP_DEPS%\node_modules" "%BACKEND%node_modules" /E /NFL /NDL /NJH /NJS /nc /ns /np >nul

cd /d "%BACKEND%"
call npm install

echo.
echo Done! Parser dependencies installed successfully.
echo Run: npm run dev
