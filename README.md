Web app for configuring _*ls/ts/rh host*_, normally it is a x86 mini host, rasberry pi, photonicat board, etc.,

## Development

### Prepare node.js, 
This project reauires node _v16.18.0_, so first need to setup node _v16.18.0_

```
nvm use 16
```

### Clone the repo
```
git clone git@github.com:jercylew/ls-host-config.git
```

### Install dependency
```
cd ls-host-config
yarn install # Or yarn
```

### Run it in debug mode
```
yarn start
```
Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### Build package for release

```
yarn run build
```


Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


