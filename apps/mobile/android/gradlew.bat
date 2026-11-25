@rem =========================================================================
@rem Gradle Wrapper for Windows - MudraKosh
@rem =========================================================================

@if "%DEBUG%" == "" @echo off
setlocal

@rem Set JAVA_HOME if invalid or not set
if not exist "%JAVA_HOME%\bin\java.exe" (
    if exist "C:\Program Files\Android\Android Studio\jbr\bin\java.exe" (
        set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
    )
)

set "APP_BASE_NAME=%~nx0"
set "APP_HOME=%~dp0"

@rem Use Gradle >= 8.7 (Gradle 9.0 available in user cache)
if exist "C:\Users\USER\.gradle\wrapper\dists\gradle-9.0.0-bin\d6wjpkvcgsg3oed0qlfss3wgl\gradle-9.0.0\bin\gradle.bat" (
    call "C:\Users\USER\.gradle\wrapper\dists\gradle-9.0.0-bin\d6wjpkvcgsg3oed0qlfss3wgl\gradle-9.0.0\bin\gradle.bat" %*
    exit /b %ERRORLEVEL%
)

if exist "C:\Users\USER\.gradle\wrapper\dists\gradle-8.6-bin\afr5mpiioh2wthjmwnkmdsd5w\gradle-8.6\bin\gradle.bat" (
    call "C:\Users\USER\.gradle\wrapper\dists\gradle-8.6-bin\afr5mpiioh2wthjmwnkmdsd5w\gradle-8.6\bin\gradle.bat" %*
    exit /b %ERRORLEVEL%
)

@rem Otherwise fallback to any gradle on PATH
gradle.bat %*
exit /b %ERRORLEVEL%

endlocal
