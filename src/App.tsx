import React from 'react';

import { Button } from 'base';

function loadComponent (scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    /*global __webpack_init_sharing__*/
    /*eslint no-undef: "error"*/
    await __webpack_init_sharing__('default');
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules

    /*global __webpack_share_scopes__*/
    /*eslint no-undef: "error"*/
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

const useDynamicScript = (args) => {
  const [ ready, setReady ] = React.useState(false);
  const [ failed, setFailed ] = React.useState(false);

  React.useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement('script');

    element.src = args.url;
    element.type = 'text/javascript';
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      document.head.removeChild(element);
    };
  }, [ args.url ]);

  return {
    ready,
    failed,
  };
};

function System (props) {
  const { ready, failed } = useDynamicScript({
    url: props.system && props.system.url,
  });

  if (!props.system) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.system.url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.system.url}</h2>;
  }

  if (Object.values(props.system.modules).length > 1) {
    const Widget = React.lazy(loadComponent(props.system.scope, props.system.modules.widget));
    const Card = React.lazy(loadComponent(props.system.scope, props.system.modules.card));
    const Circle = React.lazy(loadComponent(props.system.scope, props.system.modules.circle));


    const flexStyle = { display: 'flex' };

    return (
      <React.Suspense fallback='Loading System'>
        <Widget />
        <div style={flexStyle}>
          <Card />
          <Circle />
        </div>
      </React.Suspense>
    );
  }

  const Component = React.lazy(loadComponent(props.system.scope, props.system.modules.widget));

  return (
    <React.Suspense fallback='Loading System'>
      <Component />
    </React.Suspense>
  );
}

function App () {
  const [ system, setSystem ] = React.useState(undefined);

  function setApp2 () {
    console.log('node.', process.env.NODE_ENV);

    setSystem({
      url: process.env.NODE_ENV === 'development' ? 'http://localhost:3002/remoteEntry.js' : 'http://localhost:3001/mfe1/remoteEntry.js',
      scope: 'mfe1',
      modules: {
        widget: './Widget',
        card: './Card',
        circle: './Circle'
      }

    });
  }

  function setApp3 () {
    setSystem({
      url: process.env.NODE_ENV === 'development' ? 'http://localhost:3003/remoteEntry.js' : 'http://localhost:3001/mfe2/remoteEntry.js',
      scope: 'mfe2',
      modules: { widget: './Widget' }
    });
  }

  return (
    <div>
      <h1>Dynamic System Host</h1>
      <h2>App 1</h2>
      <p>
        The Dynamic System will take advantage Module Federation{' '}
        <strong>remotes</strong> and <strong>exposes</strong>. It will no load
        components that have been loaded already.
      </p>
      <Button onClick={setApp2} title='Load App 2 Widget' background='#ff0000' />
      <Button onClick={setApp3} title='Load App 3 Widget' background='#00ffff' />

      <br /><br />
      <div>
        <System system={system} />
      </div>
    </div>
  );
}

export default App;
