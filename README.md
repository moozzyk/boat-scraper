# boat-scraper


## Docker

### Helpful commands: 

- build a container: `docker build . -t moozzyk/boat-scraper`
- start a container (also creates and attaches a volume for the db): `docker run -dp 3000:3000 --mount type=volume,src=boat-scraper-vol,target=/home/app-user/.boat-scraper -d moozzyk/boat-scraper`
- copy db onto the volume (scraper.js will create a new db if none exists): `docker cp ~/tmp/scraperdb ecbe3cdd3c47:/home/app-user/.boat-scraper/`. **The owner of the file will be `node` and `app-user` will not have permissions to write (i.e. `scrape.js` will fail)**
- log into container as root: `docker exec -it --user root ecbe3cdd3c47 /bin/bash`
- change owner to allow writing: `chown -R app-user:app-user ~/.boat-scraper/scraperdb`

### Steps to update
```
docker stop tender_dhawan
docker run -dp 3000:3000 --mount type=volume,src=boat-scraper-vol,target=/home/app-user/.boat-scraper -d moozzyk/boat-scraper
docker ps # get the new image name
docker rm tender_dhawan
docker rename {new_image_name} tender_dhawan # 
```
