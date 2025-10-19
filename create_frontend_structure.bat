@echo off
echo Creating Complete Frontend Structure...
echo.

REM Create all directories
mkdir src\app\auth\login 2>nul
mkdir src\app\auth\register 2>nul
mkdir src\app\dashboard\analytics 2>nul
mkdir src\app\dashboard\trades 2>nul
mkdir src\app\dashboard\settings 2>nul
mkdir src\components\dashboard 2>nul
mkdir src\components\ui 2>nul
mkdir src\contexts 2>nul
mkdir src\services 2>nul
mkdir src\types 2>nul
mkdir src\lib 2>nul
mkdir public 2>nul

echo Directories created successfully!
echo.
echo Now copy and paste the file contents from the document I'll provide...
echo.
pause
