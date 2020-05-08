
# Udacity Cloud Developer

  ### TravisCI status

 [![Build Status](https://travis-ci.org/hons82/cloud-developer.png)](https://travis-ci.org/hons82/cloud-developer)

### Docker
Project is using `dotenv` so the easiest way is to setup a `.env` file under `./course-03/exercises/udacity-c3-deployment/docker` with all the environment variables set
#### Build
`docker-compose -f ./docker-compose-build.yaml build --parallel`
#### Push
`docker-compose -f ./docker-compose.yaml push`
#### Run
`docker-compose up`
##### to see it on 
`localhost:8100`

#### Docker Hub 

-  [hons82/reverseproxy](https://hub.docker.com/repository/docker/hons82/reverseproxy)
-  [hons82/udacity-frontend](https://hub.docker.com/repository/docker/hons82/udacity-frontend)
-  [hons82/udacity-restapi-feed](https://hub.docker.com/repository/docker/hons82/udacity-restapi-feed)
-  [hons82/udacity-restapi-user](https://hub.docker.com/repository/docker/hons82/udacity-restapi-user)

### Kubernetes
#### Configure cluster
[KubeOne](https://github.com/kubermatic/kubeone/blob/master/docs/quickstart-aws.md)

#### Setup config map

`./course-03/exercises/udacity-c3-deployment/docker/k8s/env-configmap.yaml`.

#### Setup secrets
`./course-03/exercises/udacity-c3-deployment/docker/k8s/env-secrets.yaml` and 
`./course-03/exercises/udacity-c3-deployment/docker/k8s/aws-secret.yaml`.

##### Convert values to base64 strings
`echo yourstring | base64` for single values or
`base64 -in /path/to/file` to convert a file.

#### Load the environment
`kubectl apply -f ./course-03/exercises/udacity-c3-deployment/docker/k8s/.` 
`kubectl get all` or `kubectl get pods` to get stats.

#### Port-forward
`kubectl port-forward service/frontend 8100:8100`
`kubectl port-forward service/reverseproxy 8080:8080`
##### to see it on 
`localhost:8100`
