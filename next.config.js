const withTM = require("next-transpile-modules")(["d3-format", "@wizard-ui/core",
"@wizard-ui/react"]);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  experimental: {
    esmExternals: 'loose'
  },
  webpack(config, { isServer, dev }) {
    // Enable webassembly
    config.experiments = { asyncWebAssembly: true };

    // In prod mode and in the server bundle (the place where this "chunks" bug
    // appears), use the client static directory for the same .wasm bundle
    config.output.webassemblyModuleFilename =
      isServer && !dev ? "../static/wasm/[id].wasm" : "static/wasm/[id].wasm";

    // Ensure the filename for the .wasm bundle is the same on both the client
    // and the server (as in any other mode the ID's won't match)
    config.optimization.moduleIds = "named";

    return config;
  },
};

module.exports = withTM(config);
