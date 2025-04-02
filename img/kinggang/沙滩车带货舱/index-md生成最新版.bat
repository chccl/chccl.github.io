@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

REM 用户自定义的基础路径（示例值，可修改或注释掉）
set "customBase=https://raw.githubusercontent.com/chccl/kinggang/main"

echo Generating index.md and gallery-group-main.txt...

REM 保存当前路径并自动确定图片路径
set "currentPath=%cd%"
for %%a in ("%currentPath%") do set "folderName=%%~nxa"
set "parentPath=%currentPath%"
set "imgPath="

:FIND_IMG_PATH
REM 注释掉原有的 img 目录查找逻辑，直接使用 customBase
goto :USE_RELATIVE

:USE_RELATIVE
REM 直接使用自定义基础路径 + 当前目录名
set "imgPath=/%folderName%"

:CONTINUE
REM 如果定义了 customBase，直接拼接基础路径和目录名
if defined customBase (
    set "imgPath=!customBase!%imgPath%"
)
echo Image Path: %imgPath%

if exist "gallery-group-main.txt" del /f /q "gallery-group-main.txt"
echo ^<div class="gallery-group-main"^>> gallery-group-main.txt

REM 遍历每个子文件夹生成文件
for /d %%d in (*) do (
    echo Processing: %%d
    if exist "%%d\index.md" del /f /q "%%d\index.md"
    
    echo --->> "%%d\index.md"
    echo title: %%d>> "%%d\index.md"
    echo ^{%% gallery %%^}>> "%%d\index.md"
    echo.>> "%%d\index.md"
    
    set "processed="
    set "count=0"
    set "thumbnail="
    
    for %%f in ("%%d\*.jpg" "%%d\*.JPG" "%%d\*.jpeg" "%%d\*.JPEG" "%%d\*.png" "%%d\*.PNG" "%%d\*.gif" "%%d\*.GIF") do (
        set "filename=%%~nf%%~xf"
        set "duplicate=0"
        for %%p in (!processed!) do if /i "%%p"=="!filename!" set "duplicate=1"
        if !duplicate!==0 (
            echo ^^^!^[%%d^]^(%imgPath%/%%d/!filename!^)>> "%%d\index.md"
            set /a count+=1
            set "processed=!processed! !filename!"
            if "!thumbnail!"=="" set "thumbnail=!filename!"
        )
    )
    
    echo.>> "%%d\index.md"
    echo ^{%% endgallery %%^}>> "%%d\index.md"
    echo Created: %%d\index.md ^(!count! images^)
    
    if !count! gtr 0 (
        if "!thumbnail!"=="" (
            echo ^^^{%% galleryGroup 'Name' '%%d' '%imgPath%/%%d/' https://via.placeholder.com/150 %%^^^}>> gallery-group-main.txt
        ) else (
            echo ^^^{%% galleryGroup 'Name' '%%d' '%imgPath%/%%d/' %imgPath%/%%d/!thumbnail! %%^^^}>> gallery-group-main.txt
        )
    )
)

echo ^</div^>>> gallery-group-main.txt

REM 删除确认步骤（保留原有逻辑）
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