fetch("https://registry.npmjs.org/expo/54.0.0").then(r => r.json()).then(d => console.log(d.peerDependencies));
