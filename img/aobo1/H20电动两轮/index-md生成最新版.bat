@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

REM 用户自定义的基础路径（示例值，可修改或注释掉）
set "customBase=https://raw.githubusercontent.com/chccl/aobo1/main"

echo Generating index.md and gallery-group-main.txt...

REM 获取当前路径和父目录信息
set "currentPath=%cd%"
for %%a in ("%currentPath%") do set "folderName=%%~nxa"
for %%a in ("%currentPath%\..") do set "parentFolder=%%~nxa"

REM 自动生成相对路径
set "relativeBase=/img/%parentFolder%/%folderName%"
set "imgPath="

:USE_RELATIVE_PATH
set "imgPath=/%folderName%"

:CONTINUE
if defined customBase (
    set "imgPath=!customBase!%imgPath%"
)
echo Image Path: %imgPath%
echo Relative Path: %relativeBase%

if exist "gallery-group-main.txt" del /f /q "gallery-group-main.txt"
echo ^<div class="gallery-group-main"^>> gallery-group-main.txt

for /d %%d in (*) do (
    echo Processing: %%d
    if exist "%%d\index.md" del /f /q "%%d\index.md"
    
    REM 生成无title的index.md
    echo --->> "%%d\index.md"
    echo ^{%% gallery %%^}>> "%%d\index.md"
    echo.>> "%%d\index.md"
    
    set "processed="
    set "count=0"
    set "thumbnail="
    
    for %%f in ("%%d\*.*") do (
        set "filename=%%~nxf"
        set "ext=%%~xf"
        set "isImage=0"
        if /i "!ext!"==".jpg" set "isImage=1"
        if /i "!ext!"==".jpeg" set "isImage=1"
        if /i "!ext!"==".png" set "isImage=1"
        if /i "!ext!"==".gif" set "isImage=1"
        
        if !isImage!==1 (
            set "duplicate=0"
            for %%p in (!processed!) do if /i "%%p"=="!filename!" set "duplicate=1"
            if !duplicate!==0 (
                echo ^^^!^[%%d^]^(%imgPath%/%%d/!filename!^)>> "%%d\index.md"
                set /a count+=1
                set "processed=!processed! !filename!"
                if "!thumbnail!"=="" set "thumbnail=!filename!"
            )
        )
    )
    
    echo.>> "%%d\index.md"
    echo ^{%% endgallery %%^}>> "%%d\index.md"
    echo Created: %%d\index.md ^(!count! images^)
    
    if !count! gtr 0 (
        set "galleryPath=%relativeBase%/%%d"
        set "thumbUrl=%imgPath%/%%d/!thumbnail!"
        if "!thumbnail!"=="" set "thumbUrl=https://via.placeholder.com/150"
        
        echo ^^^{%% galleryGroup '%%d' '%%d' '!galleryPath!/' "!thumbUrl!" %%^^^}>> gallery-group-main.txt
    )
)

echo ^</div^>>> gallery-group-main.txt

REM 保持原有的删除确认逻辑
:CONFIRM_DELETE
set "userInput="
echo WARNING: This will delete ALL images in subfolders!
set /p "userInput=Are you sure you want to delete all images? (Y/N): "

for /f "tokens=*" %%i in ("%userInput%") do set "userInput=%%i"
set "userInput=!userInput:~0,1!"

if /i "!userInput!"=="Y" (
    echo Deleting all images in subfolders...
    for /d %%d in (*) do (
        del /q "%%d\*.jpg" "%%d\*.JPG" "%%d\*.jpeg" "%%d\*.JPEG" "%%d\*.png" "%%d\*.PNG" "%%d\*.gif" "%%d\*.GIF" 2>nul
        echo Cleaned: %%d
    )
    echo All images deleted!
) else (
    echo Operation cancelled. No images were deleted.
)

echo All index.md files generated!
echo gallery-group-main.txt generated!
pause