FROM golang:1.10-alpine

ENV GOPATH=/go

COPY . "/go/src/github.com/user/velofggorest"
WORKDIR "/go/src/github.com/user/velofggorest"

# Set the Current Working Directory inside the container

# Copy everything from the current directory to the PWD (Present Working Directory) inside the container

# Download all the dependencies

#RUN go mod init
#RUN go mod tidy
#RUN go mod vendor

RUN go get ./...

# Install the package
RUN go install -v ./...

# This container exposes port 8080 to the outside world
EXPOSE 8080

# Run the executable
CMD ["go", "run", "main.go"]