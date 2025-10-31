@echo off
echo ================================================
echo   Starting Samyak Gyan Local Server
echo ================================================
echo.
echo Server will start on port 8000
echo.
echo On this computer, open:
echo   http://localhost:8000/articles.html
echo.
echo On your mobile/tablet, open:
echo   http://192.168.1.10:8000/articles.html
echo.
echo ================================================
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
