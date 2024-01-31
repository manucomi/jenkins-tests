# mfe-articles

This micro front-end contains article pages served from
`/YYYY/MM/some-article-slug`.

## Getting Started

### 1. Configure your NPM credentials

This project uses mfe-core, an NPM package that is hosted on HBP's private
NPM registry. In this step you'll configure NPM to authenticate with the
registry.

To proceed you'll need to know your Nexus username and password. This is a
different username and password than the ones you use for Okta. You can test
your username and password by logging into the
[Nexus web interface](https://nexus.hbsp.harvard.edu/). If you don't know your
Nexus username and password, DevOps should be able to help create them or reset
them for you.

Using your Nexus username and password you'll generate an authentication token.
The token consists of your Nexus username, a colon, and then your Nexus
password. That string is then base64 encoded. You can do this easily using the
following bash command:

```bash
echo -n 'NEXUS_USERNAME:NEXUS_PASSWORD' | openssl base64
```

Now that you have your authentication token, you'll need to edit the .npmrc
file for your user. The file is typically stored in your user's home directory
(`~/.npmrc`). If you don't have one of these files, you may need to create it.

Once you've located or created the .npmrc file, add or edit the following
configurations:

```
email=YOUR-HARVARD-EMAIL-HERE
strict-ssl=false
always-auth=true
//nexus.hbsp.harvard.edu:8081/content/groups/npm-all/:_auth=YOUR-TOKEN-HERE
```

Save the file.

### 2. Clone the project

Clone this repository with your preferred GUI, IDE, or Git CLI.

### 3. Install the NPM dependencies

```bash
npm i
```

### 4. Run the project setup

*This script requires admin privileges. If you encounter permission issues
when you run this, you can try adding `sudo` to the `dns-alias` script.*

```bash
npm run setup
```

This script will:
- Create an alias for `mfe.dev.hbr.org` pointing to `localhost`.

### 5. Build and run the app

```bash
npm run dev
```

Navigate to [https://mfe.dev.hbr.org:3000/](https://mfe.dev.hbr.org:3000/) in
your browser. If you're using Chrome and get a warning about the site being
unsafe, type `thisisunsafe` to bypass the warning.

## Tools

### Unit Tests

#### Tools
- Jest
- React Testing Library

Run the tests with
```bash
npm test
```

### Linters

#### ESLint

without automatic fixes
```bash
npm run lint:js
```

with automatic fixes
```bash
npm run lint:js:fix
```

#### Stylelint

without automatic fixes
```bash
npm run lint:scss
```

with automatic fixes
```bash
npm run lint:scss:fix
```

#### All linters

without automatic fixes
```bash
npm run lint
```

with automatic fixes
```bash
npm run lint:fix
```


### Chromatic
[Chromatic](https://www.chromatic.com/) is a service from the makers of Storybook.
 We mainly use it to publish our storybook and perform visual regression testing.

####  Workflow

We publish our storybook to Chromatic when changes are pushed to `main` and for each
pull request against the `main` branch.

##### Push to `main`

When publishing upon push to `main`, we set a new baseline for feature branches. Changes
are automatically accepted when they occur on the `main` branch.

##### Pull Requests

Upon publishing, Chromatic will run visual regression tests against all the component
feature stories. If it finds any changes, the Jenkins build will fail and block
pull requests from being merged. When changes occur, it's either because there's a
bug or an intended change. To determine which it is, the changes need to be reviewed
in Chromatic. If the changes are intended, then they need to be accepted and the
Jenkins build needs to be re-run. If the changes are due to bugs, Chromatic will run
again when the fixes are pushed.

Changes in Chromatic should only be accepted or declined by a reviewer, QA team member,
or design team member. They should never be accepted or declined by the developer who
made the changes.
