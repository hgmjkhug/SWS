<<<<<<< HEAD
#Build app

docker build -t hgmjkhug/sws:latest .

docker push hgmjkhug/sws:latest

**Máy đồng nghiệp update**

docker rm -f sws-app

docker pull hgmjkhug/sws:latest

docker run -d -p 8080:80 --name sws-app hgmjkhug/sws:latest

4. Track code liên tục

docker run -d --name watchtower -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower sws --interval 30
=======
# SWS
SWS - WMS &amp; WCS | THACO
>>>>>>> f93d21c9df4b6d456188f3b148a882f511d60890
