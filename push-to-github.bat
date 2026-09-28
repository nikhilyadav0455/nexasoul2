@echo off
setlocal
echo ========================================================
echo     Grand Line Ledger - Push to GitHub Repository
echo ========================================================
echo.

set GIT_PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd\git.exe

if not exist "%GIT_PATH%" (
    set GIT_PATH=git
)

echo [1/3] Ensuring repository is on branch main...
"%GIT_PATH%" branch -M main

echo.
echo [2/3] Current Remote URL:
"%GIT_PATH%" remote -v
echo.

echo Make sure you have created the repository on GitHub:
echo https://github.com/new (Name: nexasoul2)
echo.
echo If your repository URL is different, enter it now (or press ENTER to keep current):
set /p REPO_URL="Repository URL [https://github.com/nikhil73x/nexasoul2.git]: "
if not "%REPO_URL%"=="" (
    "%GIT_PATH%" remote set-url origin %REPO_URL%
)

echo.
echo [3/3] Pushing to GitHub...
echo If prompted, enter your GitHub Username and Personal Access Token (or password).
echo.
"%GIT_PATH%" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! Your repository is now LIVE on GitHub!
    echo ========================================================
) else (
    echo ========================================================
    echo   Push failed or requires authentication.
    echo   Please check that the repo exists on GitHub and try again.
    echo ========================================================
)
echo.
pause
