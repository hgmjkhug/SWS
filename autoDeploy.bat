@echo off
echo Resetting local images...
:: Remove old tags to avoid ID confusion
docker rmi hgmjkhug/sws:latest -f

echo Starting Docker packaging process...
:: Step 1: Build Image
docker build --no-cache -t hgmjkhug/sws:latest .

:: Step 2: Push Image to Docker Hub
echo Pushing to Docker Hub, please wait...
docker push hgmjkhug/sws:latest

echo Update successfully! HMH pushed latest codes.
pause