FROM golang:alpine

ADD ./src /go/src/app
WORKDIR /go/src/app

ENV PORT=5000

CMD ["go", "run", "server.go"]