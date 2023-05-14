# @transparenza/subgraph

A subgraph that indexes review events.

## Quickstart

From a clean pull:
```sh
npm install
```

# Transparenza Subgraph

## Running tests

### Matchstick setup

We're using [Matchstick](https://github.com/LimeChain/matchstick). Matchstick supports Macs and other Ubuntu-based machines natively. For other operating systems they have a Docker-based solution (see their repo for more info).

Copy `matchstick.yaml.example` and name the copy `matchstick.yaml`. Make sure the path there is a \*_full_ working path to your monorepo's top `node_modules` folder. Matchstick compilation fails when using relative paths.

### Running tests

Run these commands in sequence

```sh
npm run prepare:local 
```

```sh
npm run codegen
```

```sh
npm run test
```

## Deploy Your Own - UPDATE subgraph name (transparenza-mumbai) in package.json

### Authenticate for GraphStudio https://thegraph.com/studio/

```sh
graph auth --studio {deployId}
```
Example: 
```sh
graph auth --studio 3d61ef26f915738c88c3850e166a7fb9
```

### Create subgraph.yaml from config template

## Prepare Subgraph
```sh
npm run prepare:mumbai

```

### Generate types to use with Typescript

```sh
npm run codegen
```

### Compile and deploy to thegraph (must be authenticated)

## Deploy Subgraph
```sh
npm run deploy:mumbai
```

## Mumbai Deployment

https://api.studio.thegraph.com/query/46766/transparenza-mumbai/v0.0.9
