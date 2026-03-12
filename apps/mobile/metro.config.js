// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, '../');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
];

// Force Metro to resolve these modules to the app's node_modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'react' || moduleName === 'react-native') {
        return context.resolveRequest(
            context,
            path.resolve(projectRoot, 'node_modules', moduleName),
            platform
        );
    }
    return context.resolveRequest(context, moduleName, platform);
};
// config.resolver.disableHierarchicalLookup = true;
module.exports = config;
