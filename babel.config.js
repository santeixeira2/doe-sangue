module.exports = function (api) {
  api.cache(true);
  // NativeWind's babel preset (react-native-css-interop) always adds
  // react-native-worklets/plugin (for Reanimated 4+). On RN 0.76 + Reanimated 3,
  // that package is incompatible as a native module; Reanimated 3 already
  // provides worklets, so we mirror nativewind/babel without that plugin.
  const nativewindInterop = function () {
    return {
      plugins: [
        require("react-native-css-interop/dist/babel-plugin").default,
        [
          "@babel/plugin-transform-react-jsx",
          {
            runtime: "automatic",
            importSource: "react-native-css-interop",
          },
        ],
      ],
    };
  };

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      nativewindInterop,
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
