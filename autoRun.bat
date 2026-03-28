@echo off
echo --- SETTING UP PROJECT AND AUTO-UPDATE (30s) ---

:: Step 1: Remove old containers if any to clean up the environment
docker rm -f sws-app watchtower 2>nul

:: Step 2: Pull the latest version from Docker Hub
echo Pulling latest version from hgmjkhug/sws...
docker pull hgmjkhug/sws:latest

:: Step 3: Run the project container
docker run -d -p 8088:80 --name sws-app hgmjkhug/sws:latest

:: Step 4: Run Watchtower to automatically "monitor" for new versions every 30 seconds
:: This command will monitor the 'sws-app' container and update it every 30s
echo Activating auto-track mode (30s)...
docker run -d --name watchtower -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower sws-app --interval 30

echo ----------------------------------------------------------
echo SUCCESS!    
echo 1. Now you'automatically can view at: http://localhost:8080
echo 2. Whenever HMH pushes new code, this machine will automatically update after 30s.
echo (No need to run this file again, just let Docker run in the background)
echo ----------------------------------------------------------
pause